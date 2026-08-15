// Variantes indépendantes réalisées par Codex pour une comparaison avec les clips d'origine.
// Aucun identifiant existant n'est remplacé : tous les IDs finissent par _codex.

const ALPHABET_CRYPTAGE_CODEX = '01<>/\\*+.';

function bruitCodex(x, y, tick, decalage = 0) {
  const valeur = Math.sin((x + 11.73) * 12.9898 + (y + 3.41) * 78.233 + (tick + decalage) * 0.173) * 43758.5453;
  return valeur - Math.floor(valeur);
}

function ajouterTexteCodex(grilleTexte, y, texte) {
  if (y < 0 || y >= ROWS) return;
  grilleTexte[y] = centrerExact(texte, COLS).split('');
}

function fusionnerRendusCodex(fond, motif) {
  const fondTexte = fond.texte.split('\n');
  const fondLum = fond.lum.split('\n');
  const motifTexte = motif.texte.split('\n');
  const motifLum = motif.lum.split('\n');
  const texte = [];
  const lum = [];
  for (let y = 0; y < ROWS; y++) {
    let ligneTexte = '';
    let ligneLum = '';
    for (let x = 0; x < COLS; x++) {
      const caractere = motifTexte[y][x];
      const estMotif = caractere && caractere !== ' ';
      ligneTexte += estMotif ? caractere : fondTexte[y][x];
      ligneLum += estMotif ? motifLum[y][x] : fondLum[y][x];
    }
    texte.push(ligneTexte);
    lum.push(ligneLum);
  }
  return { texte: texte.join('\n'), lum: lum.join('\n') };
}

function fondNarratifCodex(type, tick) {
  const centreX = COLS / 2;
  const centreY = ROWS / 2;
  return grilleEclairee((x, y) => {
    const dx = (x - centreX) / 2;
    const dy = y - centreY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vague = Math.sin(x * 0.42 + tick * 0.17) + Math.sin(y * 0.84 - tick * 0.11);

    if (type === 'nuit') {
      const etoile = bruitCodex(x, y, 0, 4);
      if (etoile > 0.982 && Math.sin(tick * 0.18 + x) > -0.25) return { car: '*', lum: 7 };
      if (etoile > 0.956) return { car: '.', lum: 4 };
      if (y === ROWS - 3 && x % 5 !== 0) return { car: '_', lum: 2 };
      return { car: ' ', lum: 0 };
    }

    if (type === 'signal') {
      const ligne = Math.floor((tick * 0.6) % ROWS);
      if (y === ligne) return { car: x % 3 === 0 ? '=' : '-', lum: 8 };
      if (Math.abs(y - ligne) === 1) return { car: '.', lum: 4 };
      if (bruitCodex(x, y, tick, 8) > 0.93) return { car: vague > 0 ? '1' : '0', lum: 3 };
      return { car: ' ', lum: 0 };
    }

    if (type === 'chute') {
      const spirale = Math.atan2(dy, dx) + distance * 0.72 - tick * 0.24;
      if (Math.abs(Math.sin(spirale)) < 0.13 && distance > 3) return { car: (x + y + tick) % 2 ? '1' : '0', lum: 6 };
      if (Math.abs(Math.sin(spirale)) < 0.28 && distance > 2) return { car: '.', lum: 3 };
      return { car: ' ', lum: 0 };
    }

    if (type === 'recherche') {
      const anneau = Math.abs((distance + tick * 0.11) % 5 - 2.5);
      if (anneau < 0.22) return { car: '.', lum: 4 };
      if (Math.abs(Math.atan2(dy, dx) - tick * 0.12) < 0.11 && distance < 13) return { car: '/', lum: 7 };
      if (distance < 0.8) return { car: '+', lum: 9 };
      return { car: ' ', lum: 0 };
    }

    if (type === 'erreur') {
      const colonne = (x + tick) % 13;
      if (colonne === 0 && y > 1 && y < ROWS - 2) return { car: '|', lum: 3 };
      if (y % 4 === 1 && x > 5 && x < 54 && bruitCodex(x, y, tick, 12) > 0.35) return { car: vague > 0 ? '-' : '.', lum: 2 };
      return { car: ' ', lum: 0 };
    }

    const rayon = 6 + Math.sin(tick * 0.12) * 1.5;
    if (distance < rayon && dx > -1) return { car: distance < 2 ? '*' : '.', lum: Math.max(5, Math.round(9 - distance / 2)) };
    if (bruitCodex(x, y, 0, 19) > 0.965) return { car: '.', lum: 4 };
    return { car: ' ', lum: 0 };
  });
}

function creerSceneCodex(id, nom, tags, config) {
  enregistrer({
    id,
    nom,
    categorie: 'histoire',
    tags: ['codex', 'comparaison', 'hibou', ...tags],
    duree_recommandee: config.duree,
    creer() {
      let tick = 0;
      let temps = 0;
      return {
        speed: 55,
        step() {
          tick += 1;
          temps += 55;
          const progression = Math.min(1, temps / config.duree);
          const motif = dessinerHibouCadre(tick, {
            echelle: config.echelleDebut + (config.echelleFin - config.echelleDebut) * progression,
            offX: config.offXDebut + (config.offXFin - config.offXDebut) * progression,
            offY: config.offYDebut + (config.offYFin - config.offYDebut) * progression,
            yeuxClignotants: false,
            ambiante: config.ambiante,
          });
          return fusionnerRendusCodex(fondNarratifCodex(config.fond, tick), motif);
        },
      };
    },
  });
}

creerSceneCodex('codex_veille', 'Codex · Veille étoilée', ['nuit', 'veille'], {
  fond: 'nuit', duree: 4000, echelleDebut: 0.34, echelleFin: 0.38,
  offXDebut: 11, offXFin: 9, offYDebut: -4, offYFin: -4, ambiante: 0.4,
});
creerSceneCodex('codex_signal', 'Codex · Signal inconnu', ['signal', 'interférence'], {
  fond: 'signal', duree: 3000, echelleDebut: 0.4, echelleFin: 0.52,
  offXDebut: 4, offXFin: -4, offYDebut: -2, offYFin: 0, ambiante: 0.36,
});
creerSceneCodex('codex_chute', 'Codex · Spirale de données', ['chute', 'données'], {
  fond: 'chute', duree: 5000, echelleDebut: 0.42, echelleFin: 0.28,
  offXDebut: -7, offXFin: 8, offYDebut: -5, offYFin: 5, ambiante: 0.17,
});
creerSceneCodex('codex_recherche', 'Codex · Balise de recherche', ['recherche', 'radar'], {
  fond: 'recherche', duree: 5000, echelleDebut: 0.31, echelleFin: 0.42,
  offXDebut: -11, offXFin: 8, offYDebut: 4, offYFin: 2, ambiante: 0.27,
});
creerSceneCodex('codex_erreur', 'Codex · Terminal sans réponse', ['erreur', 'terminal'], {
  fond: 'erreur', duree: 4000, echelleDebut: 0.5, echelleFin: 0.58,
  offXDebut: -5, offXFin: -3, offYDebut: 1, offYFin: 0, ambiante: 0.22,
});
creerSceneCodex('codex_espoir', 'Codex · Balise retrouvée', ['espoir', 'lumière'], {
  fond: 'espoir', duree: 4000, echelleDebut: 0.34, echelleFin: 0.42,
  offXDebut: -8, offXFin: 6, offYDebut: 4, offYFin: -3, ambiante: 0.58,
});

function renduHibouFaceFixeCodex() {
  const cx = COLS / 2;
  const cy = 11.8;
  const rx = 15;
  const ry = 10.2;
  const oeilY = 6.4;
  const oeilX = 5.75;

  return grilleEclairee((x, y) => {
    const dx = (x - cx) / 2;
    const dy = y - cy;
    const corps = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

    // Silhouette : un corps ovale, des ailes plus sombres et deux aigrettes.
    const aile = Math.abs(dx) > 8 && Math.abs(dx) < 15 && dy > -1.5 && dy < 4.8;
    const hautAigrette = -10.5;
    const basAigrette = -4.25;
    if (dy >= hautAigrette && dy <= basAigrette) {
      const progressionAigrette = (dy - hautAigrette) / (basAigrette - hautAigrette);
      const centreAigrette = 11.1 - 3.1 * progressionAigrette;
      const demiLargeurAigrette = 0.32 + 2.35 * progressionAigrette;
      const gauche = Math.abs(dx + centreAigrette) <= demiLargeurAigrette;
      const droite = Math.abs(dx - centreAigrette) <= demiLargeurAigrette;
      if (gauche || droite) {
        const bord = Math.abs(Math.abs(dx) - centreAigrette) > demiLargeurAigrette - 0.5;
        return { car: bord ? (gauche ? '/' : '\\') : '^', lum: gauche ? 7 : 5 };
      }
    }
    if (corps > 1) return { car: ' ', lum: 0 };

    // Chaque œil est un anneau : la pupille reste sombre pour donner du volume.
    const centreOeil = dx < 0 ? -oeilX : oeilX;
    const u = (dx - centreOeil) / 4.45;
    const v = (y - oeilY) / 3.25;
    const distanceOeil = Math.sqrt(u * u + v * v);
    if (distanceOeil < 1) {
      const reflet = Math.sqrt((u + 0.25) * (u + 0.25) + (v + 0.32) * (v + 0.32));
      if (reflet < 0.19) return { car: '*', lum: 9 };
      if (distanceOeil < 0.38) return { car: '@', lum: 1 };
      if (distanceOeil < 0.68) return { car: ' ', lum: 0 };
      if (distanceOeil < 0.88) return { car: 'O', lum: 8 };
      return { car: '.', lum: 5 };
    }

    // Bec et plastron en plumes superposées, légèrement éclairés à gauche.
    if (Math.abs(dx) < 0.85 && y > 8.6 && y < 11.2) return { car: 'v', lum: 8 };
    const plume = Math.abs(Math.round(dx * 1.3)) + Math.abs(Math.round((dy - 2.4) * 1.25));
    if (dy > 0.2 && dy < 5.2 && plume % 4 === 0) return { car: 'V', lum: x < cx ? 7 : 5 };
    if (aile && plume % 3 === 0) return { car: '/', lum: x < cx ? 5 : 3 };

    const lum = calculerLumiere(dx / rx, dy / ry, Math.sqrt(Math.max(0, 1 - corps)), 0.24);
    if (corps < 0.5) return { car: '@', lum };
    if (corps < 0.78) return { car: '*', lum };
    return { car: '.', lum };
  });
}

enregistrer({
  id: 'hibou_face_fixe_codex',
  nom: 'Hibou de face fixe — Codex',
  categorie: 'vie',
  tags: ['codex', 'hibou', 'fixe', 'portrait', 'ascii', 'référence'],
  duree_recommandee: 0,
  creer() {
    const rendu = renduHibouFaceFixeCodex();
    return {
      speed: 250,
      step() {
        return rendu;
      },
    };
  },
});

enregistrer({
  id: 'logo_serenia_codex',
  nom: 'Logo SérénIA Tech — variante Codex',
  categorie: 'histoire',
  tags: ['codex', 'comparaison', 'logo', 'serenia', 'outro'],
  duree_recommandee: 8000,
  creer() {
    let tick = 0;
    const texte = centrerExact('SérénIA Tech', COLS);
    const signature = centrerExact('INTELLIGENCE SEREINE', COLS);
    return {
      speed: 50,
      step() {
        tick += 1;
        const apparition = Math.min(1, tick / 42);
        const souffle = Math.sin(tick / 9);
        return grilleEclairee((x, y) => {
          const bordX = x === 8 || x === 51;
          const bordY = y === 4 || y === 13;
          const dansCadre = x >= 8 && x <= 51 && y >= 4 && y <= 13;
          if (dansCadre && (bordX || bordY)) {
            const distanceBord = Math.min(Math.abs(x - 8), Math.abs(x - 51), Math.abs(y - 4), Math.abs(y - 13));
            const revele = (x + y * 2) / 80;
            if (apparition > revele) return { car: (x === 8 || x === 51) && (y === 4 || y === 13) ? '+' : (bordY ? '-' : '|'), lum: 6 + Math.round((souffle + 1) * 1.2) };
          }
          if (y === 8 && texte[x] !== ' ') {
            const distanceCentre = Math.abs(x - COLS / 2) / 22;
            if (apparition > distanceCentre) return { car: texte[x], lum: 8 };
            const chiffre = Math.floor(bruitCodex(x, y, tick, 31) * ALPHABET_CRYPTAGE_CODEX.length);
            return { car: ALPHABET_CRYPTAGE_CODEX[chiffre], lum: 3 };
          }
          if (y === 11 && apparition > 0.7) return { car: signature[x], lum: 5 };
          if (!dansCadre && bruitCodex(x, y, tick, 27) > 0.987 - apparition * 0.018) return { car: '.', lum: 2 };
          return { car: ' ', lum: 0 };
        });
      },
    };
  },
});
