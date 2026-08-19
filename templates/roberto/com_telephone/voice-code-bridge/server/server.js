const http = require("http");
const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");

const PORT = process.env.PORT || 5000;
const STT_PORT = process.env.STT_PORT || 5001;
const TTS_PORT = process.env.TTS_PORT || 5002;
const MOBILE_DIR = path.join(__dirname, "..", "mobile");
const MESSAGES_LOG = path.join(__dirname, "messages.log");

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css"
};

const httpServer = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/send") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      let text;
      try {
        text = JSON.parse(body).text;
      } catch {
        res.writeHead(400);
        res.end("Corps invalide");
        return;
      }

      const ttsReq = http.request({
        host: "127.0.0.1",
        port: TTS_PORT,
        path: "/synthesize",
        method: "POST",
        headers: { "Content-Type": "application/json" }
      }, (ttsRes) => {
        const chunks = [];
        ttsRes.on("data", (chunk) => chunks.push(chunk));
        ttsRes.on("end", () => {
          const audioB64 = Buffer.concat(chunks).toString("base64");

          let sent = 0;
          wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
              client.send(JSON.stringify({ type: "assistant.text", text }));
              client.send(JSON.stringify({ type: "assistant.audio", audio: audioB64, mime: "audio/wav" }));
              sent++;
            }
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ sent }));
        });
      });

      ttsReq.on("error", () => {
        let sent = 0;
        wss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify({ type: "assistant.text", text }));
            client.send(JSON.stringify({ type: "state", state: "listening" }));
            sent++;
          }
        });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ sent, tts: "indisponible" }));
      });

      ttsReq.end(JSON.stringify({ text }));
    });
    return;
  }

  if (req.method === "POST" && req.url === "/transcribe") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const audio = Buffer.concat(chunks);

      const sttReq = http.request({
        host: "127.0.0.1",
        port: STT_PORT,
        path: "/transcribe",
        method: "POST",
        headers: { "Content-Length": audio.length }
      }, (sttRes) => {
        let body = "";
        sttRes.on("data", (chunk) => { body += chunk; });
        sttRes.on("end", () => {
          res.writeHead(sttRes.statusCode, { "Content-Type": "application/json" });
          res.end(body);
        });
      });

      sttReq.on("error", () => {
        res.writeHead(502, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "STT indisponible" }));
      });

      sttReq.end(audio);
    });
    return;
  }

  if (req.method === "POST" && req.url === "/debug") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      let text;
      try {
        text = JSON.parse(body).text;
      } catch {
        res.writeHead(400);
        res.end("Corps invalide");
        return;
      }

      const line = `${new Date().toISOString()}\t[DEBUG] ${text}\n`;
      fs.appendFile(MESSAGES_LOG, line, () => {});

      res.writeHead(200);
      res.end("ok");
    });
    return;
  }

  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(MOBILE_DIR, filePath);

  if (!filePath.startsWith(MOBILE_DIR)) {
    res.writeHead(403);
    res.end("Interdit");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Introuvable");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(content);
  });
});

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  console.log(`[${new Date().toISOString()}] Client connecte`);

  const keepAlive = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.ping();
    }
  }, 20000);

  ws.send(JSON.stringify({ type: "state", state: "listening" }));

  ws.on("message", (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    console.log("Recu:", msg);

    if (msg.type === "client.log") {
      const line = `${new Date().toISOString()}\t[DEBUG] ${msg.text}\n`;
      fs.appendFile(MESSAGES_LOG, line, () => {});
      return;
    }

    if (msg.type === "user.message") {
      const line = `${new Date().toISOString()}\t${msg.text}\n`;
      fs.appendFile(MESSAGES_LOG, line, () => {});

      ws.send(JSON.stringify({ type: "state", state: "processing" }));
    }
  });

  ws.on("close", () => {
    clearInterval(keepAlive);
    console.log(`[${new Date().toISOString()}] Client deconnecte`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Serveur HTTP + WebSocket demarre sur le port ${PORT}`);
});
