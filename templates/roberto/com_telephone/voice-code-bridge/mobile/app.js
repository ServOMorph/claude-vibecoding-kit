const connDot = document.getElementById("connDot");
const connLabel = document.getElementById("connLabel");
const stateLabel = document.getElementById("stateLabel");
const chat = document.getElementById("chat");
const composer = document.getElementById("composer");
const textInput = document.getElementById("textInput");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");
const voiceScreen = document.getElementById("voiceScreen");
const voiceCircle = document.getElementById("voiceCircle");
const voiceStatus = document.getElementById("voiceStatus");
const voiceCancel = document.getElementById("voiceCancel");
const voicePause = document.getElementById("voicePause");
const assistantAudioEl = document.getElementById("assistantAudio");

let ws = null;
let reconnectTimer = null;
let mediaRecorder = null;
let audioStream = null;
let audioContext = null;
let silenceTimer = null;
let maxDurationTimer = null;
let hasSpoken = false;
let voiceCancelled = false;
let voicePaused = false;
let discardNextRecording = false;
let currentAudio = null;
let audioUnlocked = false;

const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";

function unlockAudioElement() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  assistantAudioEl.src = SILENT_WAV;
  assistantAudioEl.play().then(() => {
    assistantAudioEl.pause();
    assistantAudioEl.currentTime = 0;
  }).catch(() => {
    audioUnlocked = false;
  });
}

const SPEECH_THRESHOLD = 0.02;
const SILENCE_MS = 900;
const MAX_DURATION_MS = 15000;

function wsUrl() {
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const portSuffix = window.location.port ? `:${window.location.port}` : "";
  return `${protocol}//${window.location.hostname}${portSuffix}`;
}

function setConnected(connected) {
  connDot.classList.toggle("connected", connected);
  connLabel.textContent = connected ? "Connecte" : "Deconnecte";
}

function setState(state) {
  const labels = {
    listening: "Ecoute",
    processing: "Traitement",
    speaking: "Reponse",
    error: "Erreur"
  };
  stateLabel.textContent = labels[state] || "";
}

function addBubble(role, text) {
  const el = document.createElement("div");
  el.className = `bubble ${role}`;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

function connect() {
  ws = new WebSocket(wsUrl());

  ws.onopen = () => {
    setConnected(true);
    clearTimeout(reconnectTimer);
  };

  ws.onclose = () => {
    setConnected(false);
    reconnectTimer = setTimeout(connect, 3000);
  };

  ws.onerror = () => {
    setConnected(false);
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    if (msg.type === "state") {
      setState(msg.state);
    } else if (msg.type === "assistant.text") {
      addBubble("assistant", msg.text);
    } else if (msg.type === "assistant.audio") {
      playAssistantAudio(msg.audio, msg.mime);
    }
  };
}

function playAssistantAudio(base64, mime) {
  const inVoiceMode = voiceScreen.classList.contains("active") && !voiceCancelled;
  if (inVoiceMode) {
    voiceCircle.classList.remove("thinking");
    voiceCircle.classList.add("done");
    voiceStatus.textContent = "Titi vous repond...";
  }

  const audio = assistantAudioEl;
  currentAudio = audio;

  const resumeListening = () => {
    if (currentAudio !== audio) return;
    currentAudio = null;
    audio.onended = null;
    audio.onerror = null;
    if (inVoiceMode && !voiceCancelled && !voicePaused) {
      startVoiceCapture();
    } else if (voicePaused) {
      voiceCircle.classList.add("paused");
      voiceStatus.textContent = "Micro en pause";
    }
  };

  audio.onended = resumeListening;
  audio.onerror = () => {
    debugLog("erreur lecture audio assistant");
    resumeListening();
  };

  audio.src = `data:${mime};base64,${base64}`;
  audio.play().catch((err) => {
    debugLog(`autoplay bloque: ${err.message}`);
    resumeListening();
  });
}

function sendUserMessage(text) {
  if (!text || !ws || ws.readyState !== WebSocket.OPEN) return;
  addBubble("user", text);
  ws.send(JSON.stringify({ type: "user.message", text }));
}

composer.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = textInput.value.trim();
  sendUserMessage(text);
  textInput.value = "";
});

function openVoiceScreen() {
  voiceScreen.classList.add("active");
  voiceCircle.classList.remove("done", "thinking", "paused");
  voiceStatus.textContent = "Je vous ecoute...";
  voicePause.textContent = "Pause micro";
}

function closeVoiceScreen() {
  voiceScreen.classList.remove("active");
}

function debugLog(text) {
  fetch("/debug", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  }).catch(() => {});
}

function pickMimeType() {
  const candidates = ["audio/webm", "audio/mp4", "audio/ogg"];
  for (const type of candidates) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function stopStream() {
  clearTimeout(silenceTimer);
  clearTimeout(maxDurationTimer);
  if (audioStream) {
    audioStream.getTracks().forEach((t) => t.stop());
    audioStream = null;
  }
  if (audioContext) {
    audioContext.close().catch(() => {});
    audioContext = null;
  }
}

function confirmAndSend(transcript) {
  voiceCircle.classList.add("done");
  voiceStatus.textContent = "Compris, j'envoie a Titi";

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    sendUserMessage(transcript);

    voiceCircle.classList.remove("done");
    voiceCircle.classList.add("thinking");
    voiceStatus.textContent = "Titi reflechit...";
  };

  if (window.speechSynthesis) {
    const utterance = new SpeechSynthesisUtterance("Compris, j'envoie a Titi");
    utterance.lang = "fr-FR";
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    setTimeout(finish, 3500);
  } else {
    setTimeout(finish, 800);
  }
}

const WHISPER_HALLUCINATIONS = [
  "sous-titres réalisés par la communauté d'amara.org",
  "sous-titrage st' 501",
  "merci d'avoir regardé cette vidéo",
  "abonnez-vous"
];

function isHallucination(text) {
  const lower = text.toLowerCase().trim();
  return WHISPER_HALLUCINATIONS.some((h) => lower.includes(h));
}

async function transcribeAudio(blob) {
  voiceStatus.textContent = "Transcription en cours...";
  try {
    const res = await fetch("/transcribe", {
      method: "POST",
      headers: { "Content-Type": blob.type || "application/octet-stream" },
      body: blob
    });
    const data = await res.json();

    if (!res.ok || !data.text || isHallucination(data.text)) {
      debugLog(`transcription vide/hallucination: ${JSON.stringify(data)}`);
      voiceStatus.textContent = "Rien compris, reessayez.";
      setTimeout(closeVoiceScreen, 1500);
      return;
    }

    confirmAndSend(data.text);
  } catch (err) {
    debugLog(`erreur transcription: ${err.message}`);
    voiceStatus.textContent = "Erreur de transcription.";
    setTimeout(closeVoiceScreen, 1500);
  }
}

function startVoiceCapture() {
  voiceCancelled = false;
  hasSpoken = false;

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    openVoiceScreen();
    voiceStatus.textContent = "Micro non supporte sur ce navigateur.";
    debugLog("getUserMedia indisponible");
    setTimeout(closeVoiceScreen, 2000);
    return;
  }

  openVoiceScreen();

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      if (voiceCancelled) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      audioStream = stream;
      const mimeType = pickMimeType();
      mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        stopStream();
        if (voiceCancelled) return;
        if (discardNextRecording) {
          discardNextRecording = false;
          return;
        }
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        transcribeAudio(blob);
      };

      mediaRecorder.start();
      debugLog(`enregistrement demarre (${mediaRecorder.mimeType})`);

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);

      function checkVolume() {
        if (!audioStream) return;
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);

        if (rms > SPEECH_THRESHOLD) {
          hasSpoken = true;
          clearTimeout(silenceTimer);
          silenceTimer = setTimeout(() => {
            if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
          }, SILENCE_MS);
        }

        if (audioStream) requestAnimationFrame(checkVolume);
      }
      requestAnimationFrame(checkVolume);

      maxDurationTimer = setTimeout(() => {
        if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
      }, MAX_DURATION_MS);
    })
    .catch((err) => {
      debugLog(`getUserMedia refuse ou erreur: ${err.message}`);
      voiceStatus.textContent = "Micro refuse ou indisponible.";
      setTimeout(closeVoiceScreen, 2000);
    });
}

micBtn.addEventListener("click", () => {
  unlockAudioElement();
  startVoiceCapture();
});

voicePause.addEventListener("click", () => {
  if (voicePaused) {
    voicePaused = false;
    voicePause.textContent = "Pause micro";
    startVoiceCapture();
    return;
  }

  voicePaused = true;
  voicePause.textContent = "Reprendre";
  discardNextRecording = true;
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  } else {
    stopStream();
  }
  voiceCircle.classList.remove("done", "thinking");
  voiceCircle.classList.add("paused");
  voiceStatus.textContent = "Micro en pause";
});

voiceCancel.addEventListener("click", () => {
  voiceCancelled = true;
  voicePaused = false;
  discardNextRecording = false;
  if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  stopStream();
  closeVoiceScreen();
});

connect();
debugLog(`ua: ${navigator.userAgent} | secureContext: ${window.isSecureContext} | mediaDevices: ${!!navigator.mediaDevices}`);
