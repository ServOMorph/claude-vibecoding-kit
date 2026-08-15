const MASCOT_ECHELLE_NATIVE = 0.75;

const historique = [];

function horodatage() {
  return new Date().toLocaleTimeString('fr-FR');
}

function log(message) {
  const ligne = `[${horodatage()}] ${message}`;
  historique.push(ligne);
  document.getElementById('status-message').textContent = message;
}

function demarrerDanse() {}

function arreterDanse() {}

function mascotEchapperCar(car) {
  if (car === '&') return '&amp;';
  if (car === '<') return '&lt;';
  if (car === '>') return '&gt;';
  return car;
}

function mascotRendreEcran(rendu) {
  const el = document.getElementById('mascot-screen');
  if (typeof rendu === 'string') {
    el.textContent = rendu;
    return;
  }
  const lignesTexte = rendu.texte.split('\n');
  const lignesLum = rendu.lum.split('\n');
  let html = '';
  for (let y = 0; y < lignesTexte.length; y++) {
    const ligneTexte = lignesTexte[y];
    const ligneLum = lignesLum[y];
    for (let x = 0; x < ligneTexte.length; x++) {
      const car = ligneTexte[x];
      html += car === ' ' ? ' ' : `<span class="l${ligneLum[x]}">${mascotEchapperCar(car)}</span>`;
    }
    if (y < lignesTexte.length - 1) html += '\n';
  }
  el.innerHTML = html;
}

function mascotInitialiser() {
  document.documentElement.style.setProperty('--mascot-echelle-native', MASCOT_ECHELLE_NATIVE);

  const animation = obtenirAnimation('hibou').creer();
  let accumulateur = 0;
  let dernierTimestamp = null;
  mascotRendreEcran(animation.step());

  function boucle(timestamp) {
    window.requestAnimationFrame(boucle);
    if (dernierTimestamp === null) dernierTimestamp = timestamp;
    accumulateur += timestamp - dernierTimestamp;
    dernierTimestamp = timestamp;
    while (accumulateur >= animation.speed) {
      mascotRendreEcran(animation.step());
      accumulateur -= animation.speed;
    }
  }
  window.requestAnimationFrame(boucle);
}

mascotInitialiser();

function rafraichirLogs() {
  const liste = document.getElementById('logs-list');
  liste.innerHTML = '';
  for (const ligne of historique) {
    const item = document.createElement('div');
    item.textContent = ligne;
    liste.appendChild(item);
  }
}

async function lancer() {
  const input = document.getElementById('program-input');
  const bouton = document.getElementById('launch-button');
  const programme = input.value.trim();
  if (!programme) return;

  log(`Lancement de ${programme}...`);
  bouton.disabled = true;
  demarrerDanse();

  const resultat = await window.pywebview.api.launch_program(programme);

  arreterDanse();
  bouton.disabled = false;
  log(resultat.message);
}

function afficherDossiersRecents(dossiers) {
  const conteneur = document.getElementById('recent-folders');
  conteneur.innerHTML = '';
  for (const dossier of dossiers) {
    const bouton = document.createElement('button');
    bouton.className = 'macro-item';
    bouton.textContent = dossier;
    bouton.addEventListener('click', () => ouvrirOpencode(dossier));
    conteneur.appendChild(bouton);
  }
}

async function ouvrirOpencode(dossier) {
  const bouton = document.getElementById('opencode-button');
  log(`Lancement d'OpenCode dans ${dossier}...`);
  bouton.disabled = true;
  demarrerDanse();

  const resultat = await window.pywebview.api.open_opencode(dossier);

  arreterDanse();
  bouton.disabled = false;
  log(resultat.message);
  afficherDossiersRecents(resultat.recent);
}

async function choisirEtOuvrirOpencode() {
  const reponse = await window.pywebview.api.choose_folder();
  if (!reponse.folder) return;
  await ouvrirOpencode(reponse.folder);
}

async function envoyerMessageOpencode() {
  const input = document.getElementById('opencode-message-input');
  const message = input.value.trim();
  if (!message) return;

  const resultat = await window.pywebview.api.send_message_to_opencode(message);

  log(resultat.message);
  if (resultat.success) input.value = '';
}

async function activerCaptureCoordonnees() {
  const resultat = await window.pywebview.api.start_coord_capture();
  log(resultat.message);
}

window.addEventListener('pywebviewready', async () => {
  document.getElementById('launch-button').addEventListener('click', lancer);
  document.getElementById('program-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') lancer();
  });
  document.getElementById('logs-button').addEventListener('click', () => {
    rafraichirLogs();
    document.getElementById('logs-modal').classList.remove('hidden');
  });
  document.getElementById('logs-close').addEventListener('click', () => {
    document.getElementById('logs-modal').classList.add('hidden');
  });
  document.getElementById('opencode-button').addEventListener('click', choisirEtOuvrirOpencode);
  document.getElementById('opencode-message-button').addEventListener('click', envoyerMessageOpencode);
  document.getElementById('opencode-message-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') envoyerMessageOpencode();
  });
  document.getElementById('capture-coord-button').addEventListener('click', activerCaptureCoordonnees);

  const dossiers = await window.pywebview.api.get_recent_folders();
  afficherDossiersRecents(dossiers);
});
