const LARGEUR_BASE_CRT = 640;

const visionneuseEl = document.querySelector('.visionneuse');
const crtContenant = document.getElementById('crt-contenant');
const crt = document.getElementById('crt');
const screen = document.getElementById('screen');
const speedInput = document.getElementById('speed');
const tailleEcranSelect = document.getElementById('taille-ecran');
const texteInput = document.getElementById('texte-source');
const toggleButton = document.getElementById('toggle');
const montagePlansButton = document.getElementById('jouer-montage-plans');
const montageCodexButton = document.getElementById('jouer-montage-codex');
const montageLogoCodexButton = document.getElementById('jouer-montage-logo-codex');
const montagePromoLinkedinButton = document.getElementById('jouer-montage-promo-linkedin');
const montagePromoExplosiveButton = document.getElementById('jouer-montage-promo-explosive');
const rechercheInput = document.getElementById('recherche');
const resultatsEl = document.getElementById('resultats');

const modeComparaisonInput = document.getElementById('mode-comparaison');
const vueB = document.getElementById('vue-b');
const crtContenantB = document.getElementById('crt-contenant-b');
const crtB = document.getElementById('crt-b');
const screenB = document.getElementById('screen-b');
const flagsAEl = document.getElementById('flags-a');
const flagsBEl = document.getElementById('flags-b');

let running = true;
let vitesseRelative = Number(speedInput.value);
let dernierTimestamp = null;
let accumulateur = 0;

let enregistrementEnCours = false;
let mediaRecorder = null;
let chunksEnregistrement = [];
let canvasCapture = null;
let ctxCapture = null;
let largeurCapture = 640;
let hauteurCapture = 400;
let tempsEnregistre = 0;

let animationCourante = null;
let idAnimationCourante = null;
let idMontageCourant = null;
let lecteurMontage = null;

const CONFIG_RENDU_INITIAL = { ...CONFIG_RENDU };
let comparaisonActive = false;
const flagsA = Object.fromEntries(Object.keys(CONFIG_RENDU).map((cle) => [cle, false]));
const flagsB = { ...CONFIG_RENDU_INITIAL };
let vueAEtat = null;
let vueBEtat = null;

function echapperCar(car) {
  if (car === '&') return '&amp;';
  if (car === '<') return '&lt;';
  if (car === '>') return '&gt;';
  return car;
}

function rendreEcranDans(el, rendu) {
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
      html += car === ' ' ? ' ' : `<span class="l${ligneLum[x]}">${echapperCar(car)}</span>`;
    }
    if (y < lignesTexte.length - 1) html += '\n';
  }
  el.innerHTML = html;
}

function rendreEcran(rendu) {
  rendreEcranDans(screen, rendu);
}

function appliquerFlags(etat) {
  for (const cle of Object.keys(CONFIG_RENDU)) CONFIG_RENDU[cle] = etat[cle];
}

function dessinerSurCanvas(ctx, rendu, largeur, hauteur, modeLinkedin) {
  ctx.fillStyle = "#05140c";
  ctx.fillRect(0, 0, largeur, hauteur);
  const cols = 60;
  const rows = 18;
  let offsetX = 20;
  let offsetY = 20;
  let taillePolice = 16;
  let hauteurLigne = 18.4;
  let largeurCol = 9.6;
  
  if (modeLinkedin) {
    taillePolice = 27;
    hauteurLigne = 31;
    largeurCol = 16.2;
    offsetX = (largeur - (cols * largeurCol)) / 2;
    offsetY = (hauteur - (rows * hauteurLigne)) / 2;
  } else {
    const echelleLargeur = largeur / 640;
    taillePolice = 16 * echelleLargeur;
    hauteurLigne = 18.4 * echelleLargeur;
    largeurCol = 9.6 * echelleLargeur;
    offsetX = 20 * echelleLargeur;
    offsetY = 20 * echelleLargeur;
  }
  
  ctx.font = `${taillePolice}px Consolas, monospace`;
  ctx.textBaseline = "top";
  
  const palette = [
    '#142920', '#1c3a2c', '#244d39', '#2c6146', '#367a56', 
    '#46d29b', '#5edcac', '#79e6bd', '#a4f2d6', '#eafff4'
  ];
  
  if (typeof rendu === 'string') {
    const lignes = rendu.split('\n');
    for (let y = 0; y < lignes.length; y++) {
      const ligne = lignes[y];
      for (let x = 0; x < ligne.length; x++) {
        const car = ligne[x];
        if (car === ' ' || !car) continue;
        ctx.fillStyle = palette[5];
        ctx.fillText(car, offsetX + x * largeurCol, offsetY + y * hauteurLigne);
      }
    }
  } else if (rendu && rendu.texte && rendu.lum) {
    const lignesTexte = rendu.texte.split('\n');
    const lignesLum = rendu.lum.split('\n');
    for (let y = 0; y < lignesTexte.length; y++) {
      const ligneT = lignesTexte[y];
      const ligneL = lignesLum[y];
      if (!ligneT) continue;
      for (let x = 0; x < ligneT.length; x++) {
        const car = ligneT[x];
        if (car === ' ' || !car) continue;
        const lumIdx = (ligneL && Number(ligneL[x])) || 0;
        ctx.fillStyle = palette[lumIdx];
        
        ctx.shadowColor = palette[lumIdx];
        ctx.shadowBlur = lumIdx >= 5 ? 4 : 0;
        
        ctx.fillText(car, offsetX + x * largeurCol, offsetY + y * hauteurLigne);
      }
    }
  }
}

function desactiverBoutonsExport(desactive) {
  document.querySelectorAll('.exporter-clip-btn, .btn-export-mini').forEach(btn => {
    btn.disabled = desactive;
    if (desactive) {
      if (btn.classList.contains('btn-export-mini')) {
        btn.textContent = '...';
      } else {
        btn.textContent = 'Exportation...';
      }
    } else {
      if (btn.classList.contains('btn-export-mini')) {
        btn.textContent = 'Exporter';
      } else {
        btn.textContent = 'Exporter';
      }
    }
  });
}

function demarrerExportation(cibleAnimationId, cibleMontageId) {
  if (enregistrementEnCours) return;
  
  const animId = cibleAnimationId || idAnimationCourante;
  const montageId = cibleMontageId || idMontageCourant;
  
  if (!animId && !montageId) {
    console.warn("Aucune cible d'exportation définie.");
    return;
  }
  
  console.log(`Début export pour : anim=${animId}, montage=${montageId}`);
  
  if (modeLinkedIn) {
    largeurCapture = 1080;
    hauteurCapture = 1050;
  } else {
    largeurCapture = 640;
    hauteurCapture = 400;
  }
  
  canvasCapture = document.createElement('canvas');
  canvasCapture.width = largeurCapture;
  canvasCapture.height = hauteurCapture;
  ctxCapture = canvasCapture.getContext('2d');
  
  chunksEnregistrement = [];
  const stream = canvasCapture.captureStream(30);
  
  // Choix dynamique du type MIME supporté
  const typesPossibles = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=h264',
    'video/mp4'
  ];
  
  let options = {};
  let typeChoisi = null;
  for (const type of typesPossibles) {
    if (MediaRecorder.isTypeSupported(type)) {
      typeChoisi = type;
      break;
    }
  }
  
  if (typeChoisi) {
    options = { mimeType: typeChoisi };
    console.log("Type MIME choisi pour MediaRecorder :", typeChoisi);
  } else {
    console.warn("Aucun type MIME explicite supporté, configuration par défaut.");
  }
  
  try {
    mediaRecorder = new MediaRecorder(stream, options);
  } catch (err) {
    console.error("Erreur d'initialisation de MediaRecorder :", err);
    alert("Impossible de démarrer l'enregistrement vidéo : votre navigateur ne supporte pas cette fonctionnalité.");
    return;
  }
  
  mediaRecorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) {
      chunksEnregistrement.push(e.data);
      console.log(`Chunk reçu : ${e.data.size} octets`);
    }
  };
  
  mediaRecorder.onstop = () => {
    console.log(`Enregistrement arrêté. Nombre de chunks : ${chunksEnregistrement.length}`);
    if (chunksEnregistrement.length === 0) {
      alert("Erreur : Aucun flux vidéo n'a pu être capturé.");
      return;
    }
    const extension = (typeChoisi && typeChoisi.includes('mp4')) ? 'mp4' : 'webm';
    const typeBlob = (typeChoisi && typeChoisi.split(';')[0]) || 'video/webm';
    const blob = new Blob(chunksEnregistrement, { type: typeBlob });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${montageId || animId || 'clip_mascotte'}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("Téléchargement de la vidéo déclenché.");
  };
  
  tempsEnregistre = 0;
  enregistrementEnCours = true;
  desactiverBoutonsExport(true);
  
  // Démarrer l'enregistrement et collecter les trames toutes les 100ms
  mediaRecorder.start(100);
  console.log("MediaRecorder démarré.");
  
  if (montageId) {
    jouerMontage(montageId);
  } else if (animId) {
    selectionnerAnimation(animId);
  }
}

function arreterEnregistrement() {
  if (!enregistrementEnCours) return;
  console.log("Demande d'arrêt d'enregistrement.");
  enregistrementEnCours = false;
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  desactiverBoutonsExport(false);
}

function creerInstance(idAnimation, idMontage) {
  if (idAnimation) {
    const inst = obtenirAnimation(idAnimation).creer();
    if (inst.reset) inst.reset();
    return { type: 'anim', inst, accumulateur: 0, dernierRendu: null };
  }
  return { type: 'montage', inst: creerLecteurMontage(idMontage), accumulateur: 0, dernierRendu: null };
}

function creerInstanceCourante(cote) {
  return creerInstance(idAnimationCourante, idMontageCourant);
}

function avancerVue(vue, etatFlags, dt) {
  appliquerFlags(etatFlags);
  if (vue.type === 'montage') {
    const rendu = vue.inst.avancer(dt);
    if (rendu !== null) vue.dernierRendu = incrusterSousTitre(rendu, vue.inst.sousTitre());
  } else {
    vue.accumulateur += dt;
    const intervalle = vue.inst.speed;
    while (vue.accumulateur >= intervalle) {
      vue.dernierRendu = vue.inst.step();
      vue.accumulateur -= intervalle;
    }
  }
  return vue.dernierRendu;
}

function construirePanneauFlags(conteneur, etatFlags, etiquette) {
  conteneur.innerHTML = '';
  const titre = document.createElement('div');
  titre.className = 'flags-titre';
  titre.textContent = etiquette;
  conteneur.appendChild(titre);
  for (const cle of Object.keys(CONFIG_RENDU)) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = etatFlags[cle];
    input.addEventListener('change', () => {
      etatFlags[cle] = input.checked;
    });
    label.appendChild(input);
    label.appendChild(document.createTextNode(' ' + cle));
    conteneur.appendChild(label);
  }
}

function initialiserComparaison() {
  vueAEtat = creerInstanceCourante('A');
  vueBEtat = creerInstanceCourante('B');
  construirePanneauFlags(flagsAEl, flagsA, 'A');
  construirePanneauFlags(flagsBEl, flagsB, 'B');

  appliquerFlags(flagsA);
  if (vueAEtat.type === 'anim') vueAEtat.dernierRendu = vueAEtat.inst.step();
  if (vueAEtat.dernierRendu) rendreEcranDans(screen, vueAEtat.dernierRendu);

  appliquerFlags(flagsB);
  if (vueBEtat.type === 'anim') vueBEtat.dernierRendu = vueBEtat.inst.step();
  if (vueBEtat.dernierRendu) rendreEcranDans(screenB, vueBEtat.dernierRendu);

  appliquerFlags(CONFIG_RENDU_INITIAL);
}

function selectionnerAnimation(id) {
  lecteurMontage = null;
  idMontageCourant = null;
  idAnimationCourante = id;
  animationCourante = obtenirAnimation(id).creer();
  if (animationCourante.reset) animationCourante.reset();
  accumulateur = 0;
  appliquerFlags(CONFIG_RENDU_INITIAL);
  rendreEcran(animationCourante.step());
  toggleButton.textContent = 'Pause';
  running = true;
  rafraichirSelection();
  if (comparaisonActive) initialiserComparaison();
}

function jouerMontage(id) {
  idAnimationCourante = null;
  idMontageCourant = id;
  lecteurMontage = creerLecteurMontage(id);
  accumulateur = 0;
  running = true;
  toggleButton.textContent = 'Pause';
  rafraichirSelection();
  if (comparaisonActive) initialiserComparaison();
}

function rafraichirSelection() {
  resultatsEl.querySelectorAll('.item-animation').forEach((el) => {
    el.classList.toggle('selectionne', el.dataset.id === idAnimationCourante);
  });
}

function rendreResultats() {
  const q = rechercheInput.value;
  const resultats = rechercherAnimations(q);
  resultatsEl.innerHTML = '';
  let categoriePrecedente = null;
  for (const def of resultats) {
    if (def.categorie !== categoriePrecedente) {
      categoriePrecedente = def.categorie;
      const titre = document.createElement('div');
      titre.className = 'groupe-titre';
      titre.textContent = CATEGORIES[def.categorie] || def.categorie;
      resultatsEl.appendChild(titre);
    }
    const item = document.createElement('div');
    item.className = 'item-animation';
    item.dataset.id = def.id;
    
    const infoNom = document.createElement('div');
    infoNom.className = 'info-nom';
    infoNom.innerHTML = `${def.nom}<span class="tags">${(def.tags || []).join(', ')}</span>`;
    infoNom.addEventListener('click', () => selectionnerAnimation(def.id));
    item.appendChild(infoNom);
    
    const btnExport = document.createElement('button');
    btnExport.className = 'btn-export-mini';
    btnExport.textContent = 'Exporter';
    btnExport.addEventListener('click', (e) => {
      e.stopPropagation();
      demarrerExportation(def.id, null);
    });
    item.appendChild(btnExport);
    
    resultatsEl.appendChild(item);
  }
  rafraichirSelection();
}

function boucle(timestamp) {
  window.requestAnimationFrame(boucle);
  if (!running) {
    dernierTimestamp = timestamp;
    return;
  }
  if (dernierTimestamp === null) dernierTimestamp = timestamp;
  const dt = (timestamp - dernierTimestamp) * vitesseRelative;
  dernierTimestamp = timestamp;

  if (comparaisonActive) {
    if (vueAEtat) {
      const renduA = avancerVue(vueAEtat, flagsA, dt);
      if (renduA !== null) rendreEcranDans(screen, renduA);
    }
    if (vueBEtat) {
      const renduB = avancerVue(vueBEtat, flagsB, dt);
      if (renduB !== null) rendreEcranDans(screenB, renduB);
    }
    appliquerFlags(CONFIG_RENDU_INITIAL);
    const termine = (vueAEtat && vueAEtat.type === 'montage' && vueAEtat.inst.estTermine())
      || (vueBEtat && vueBEtat.type === 'montage' && vueBEtat.inst.estTermine());
    if (termine) {
      running = false;
      toggleButton.textContent = 'Lecture';
    }
    return;
  }

  if (lecteurMontage) {
    const rendu = lecteurMontage.avancer(dt);
    if (rendu !== null) {
      const renduComplet = incrusterSousTitre(rendu, lecteurMontage.sousTitre());
      rendreEcran(renduComplet);
      if (enregistrementEnCours && ctxCapture) {
        dessinerSurCanvas(ctxCapture, renduComplet, largeurCapture, hauteurCapture, modeLinkedIn);
      }
    }
    if (lecteurMontage.estTermine()) {
      running = false;
      toggleButton.textContent = 'Lecture';
      if (enregistrementEnCours) arreterEnregistrement();
    }
    if (enregistrementEnCours) {
      tempsEnregistre += dt;
      if (tempsEnregistre >= (MONTAGES[idMontageCourant].duree_totale || 16000)) {
        arreterEnregistrement();
      }
    }
    return;
  }

  if (!animationCourante) return;
  accumulateur += dt;
  const intervalle = animationCourante.speed;
  let aRendu = false;
  let dernierRendu = null;
  while (accumulateur >= intervalle) {
    dernierRendu = animationCourante.step();
    rendreEcran(dernierRendu);
    accumulateur -= intervalle;
    aRendu = true;
  }
  if (aRendu && enregistrementEnCours && ctxCapture && dernierRendu) {
    dessinerSurCanvas(ctxCapture, dernierRendu, largeurCapture, hauteurCapture, modeLinkedIn);
  }
  if (enregistrementEnCours) {
    tempsEnregistre += dt;
    const limite = obtenirAnimation(idAnimationCourante).duree_recommandee || 5000;
    if (tempsEnregistre >= limite) {
      arreterEnregistrement();
    }
  }
}

rechercheInput.addEventListener('input', rendreResultats);

texteInput.addEventListener('input', () => {
  if (animationCourante && animationCourante.reset) animationCourante.reset();
});

speedInput.addEventListener('input', () => {
  vitesseRelative = Number(speedInput.value);
});

toggleButton.addEventListener('click', () => {
  running = !running;
  toggleButton.textContent = running ? 'Pause' : 'Lecture';
});

montagePlansButton.addEventListener('click', () => {
  jouerMontage('hibou_plans_cinema');
});

montageCodexButton.addEventListener('click', () => {
  jouerMontage('hibou_perdu_ia_codex');
});

montagePromoLinkedinButton.addEventListener('click', () => { jouerMontage('promo_linkedin_clip'); });
montagePromoExplosiveButton.addEventListener('click', () => { jouerMontage('promo_explosive_clip'); });
montageLogoCodexButton.addEventListener('click', () => {
  jouerMontage('logo_serenia_clip_codex');
});

document.querySelectorAll('.exporter-clip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const montageId = btn.dataset.montage;
    demarrerExportation(null, montageId);
  });
});

function redimensionnerElement(contenant, elementCrt) {
  const echelle = contenant.clientWidth / LARGEUR_BASE_CRT;
  elementCrt.style.transform = `scale(${echelle})`;
}

function redimensionnerCrt() {
  redimensionnerElement(crtContenant, crt);
  if (comparaisonActive) redimensionnerElement(crtContenantB, crtB);
}

let modeLinkedIn = false;

function definirEchelleNative(valeur) {
  if (valeur === 'linkedin') {
    modeLinkedIn = true;
    document.body.classList.add('linkedin-mode');
    document.documentElement.style.setProperty('--base-largeur-crt', '640px');
    document.documentElement.style.setProperty('--base-hauteur-crt', '622.22px');
    document.documentElement.style.setProperty('--echelle-native', '1');
    crtContenant.classList.add('linkedin-mode');
    crt.classList.add('linkedin-mode');
    if (crtContenantB) crtContenantB.classList.add('linkedin-mode');
    if (crtB) crtB.classList.add('linkedin-mode');
    redimensionnerCrt();
    return;
  }
  modeLinkedIn = false;
  document.body.classList.remove('linkedin-mode');
  document.documentElement.style.setProperty('--base-largeur-crt', '640px');
  document.documentElement.style.setProperty('--base-hauteur-crt', '400px');
  document.documentElement.style.setProperty('--echelle-native', valeur);
  redimensionnerCrt();
}

tailleEcranSelect.addEventListener('change', () => {
  const val = tailleEcranSelect.value; definirEchelleNative(val === 'linkedin' ? 'linkedin' : Number(val));
});

modeComparaisonInput.addEventListener('change', () => {
  comparaisonActive = modeComparaisonInput.checked;
  visionneuseEl.classList.toggle('comparaison', comparaisonActive);
  vueB.hidden = !comparaisonActive;
  flagsAEl.hidden = !comparaisonActive;
  flagsBEl.hidden = !comparaisonActive;
  if (comparaisonActive) {
    initialiserComparaison();
    redimensionnerCrt();
  } else {
    appliquerFlags(CONFIG_RENDU_INITIAL);
    vueAEtat = null;
    vueBEtat = null;
  }
});

window.addEventListener('resize', redimensionnerCrt);
definirEchelleNative(Number(tailleEcranSelect.value));

rendreResultats();
selectionnerAnimation('hibou_face_fixe_codex');
window.requestAnimationFrame(boucle);
