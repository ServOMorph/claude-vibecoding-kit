const COLS = 60;
const ROWS = 18;

const REGISTRE = {};
const CATEGORIES = {
  vie: 'Vie / respiration',
  mouvement: 'Mouvement',
  chute: 'Chute / flux',
  bruit: 'Bruit / texture',
  texte: 'Texte',
  plan: 'Plans (cinéma d\'animation)',
  histoire: 'Histoires (montages)',
};

function enregistrer(def) {
  if (REGISTRE[def.id]) throw new Error(`Animation dupliquée: ${def.id}`);
  REGISTRE[def.id] = def;
}

function obtenirAnimation(id) {
  return REGISTRE[id];
}

function listerAnimations() {
  return Object.values(REGISTRE).sort((a, b) => a.categorie.localeCompare(b.categorie) || a.nom.localeCompare(b.nom));
}

function rechercherAnimations(requete) {
  const q = requete.trim().toLowerCase();
  const toutes = listerAnimations();
  if (!q) return toutes;
  return toutes.filter((def) => {
    const cible = [def.id, def.nom, def.categorie, ...(def.tags || [])].join(' ').toLowerCase();
    return cible.includes(q);
  });
}

function grille(remplisseur) {
  const lignes = [];
  for (let y = 0; y < ROWS; y++) {
    let ligne = '';
    for (let x = 0; x < COLS; x++) {
      ligne += remplisseur(x, y);
    }
    lignes.push(ligne);
  }
  return lignes.join('\n');
}

function grilleEclairee(remplisseur) {
  const lignesTexte = [];
  const lignesLum = [];
  for (let y = 0; y < ROWS; y++) {
    let ligneTexte = '';
    let ligneLum = '';
    for (let x = 0; x < COLS; x++) {
      const resultat = remplisseur(x, y);
      const car = resultat && typeof resultat === 'object' ? resultat.car : resultat;
      const lum = resultat && typeof resultat === 'object' ? resultat.lum : 5;
      ligneTexte += car;
      ligneLum += Math.max(0, Math.min(9, Math.round(lum)));
    }
    lignesTexte.push(ligneTexte);
    lignesLum.push(ligneLum);
  }
  return { texte: lignesTexte.join('\n'), lum: lignesLum.join('\n') };
}

const DIRECTION_LUMIERE = (() => {
  const v = [-0.55, -0.65, 0.55];
  const norme = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  return [v[0] / norme, v[1] / norme, v[2] / norme];
})();

function calculerLumiere(nx, ny, nz, ambiante) {
  const diffus = Math.max(0, nx * DIRECTION_LUMIERE[0] + ny * DIRECTION_LUMIERE[1] + nz * DIRECTION_LUMIERE[2]);
  const valeur = ambiante + (1 - ambiante) * diffus;
  return Math.round(valeur * 9);
}

function decouperEnLignes(texte, largeur) {
  const mots = texte.split(/\s+/).filter(Boolean);
  const lignes = [];
  let courante = '';
  for (const mot of mots) {
    const essai = courante ? `${courante} ${mot}` : mot;
    if (essai.length > largeur) {
      if (courante) lignes.push(courante);
      courante = mot;
    } else {
      courante = essai;
    }
  }
  if (courante) lignes.push(courante);
  return lignes.length ? lignes : [''];
}

function centrer(ligne, largeur) {
  const marge = Math.max(0, largeur - ligne.length);
  const gauche = Math.floor(marge / 2);
  return ' '.repeat(gauche) + ligne;
}

function centrerExact(texte, largeur) {
  const t = texte.length > largeur ? texte.slice(0, largeur) : texte;
  const marge = largeur - t.length;
  const gauche = Math.floor(marge / 2);
  const droite = marge - gauche;
  return ' '.repeat(gauche) + t + ' '.repeat(droite);
}

function incrusterSousTitre(frame, texte) {
  if (!texte) return frame;
  if (frame && typeof frame === 'object') {
    const lignesTexte = frame.texte.split('\n');
    const lignesLum = frame.lum.split('\n');
    const dernier = lignesTexte.length - 1;
    lignesTexte[dernier] = centrerExact(texte, COLS);
    lignesLum[dernier] = '5'.repeat(COLS);
    return { texte: lignesTexte.join('\n'), lum: lignesLum.join('\n') };
  }
  const lignes = frame.split('\n');
  const dernier = lignes.length - 1;
  lignes[dernier] = centrerExact(texte, COLS);
  return lignes.join('\n');
}
