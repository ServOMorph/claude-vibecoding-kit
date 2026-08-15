function fabriqueRespire(id, nom, tags, opts) {
  const { plein = '@', mi = '*', bord = '.', speed = 55, ampl = 3, diviseur = 16 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'vie',
    tags,
    duree_recommandee: 4000,
    creer() {
      let tick = 0;
      return {
        speed,
        step() {
          tick += 1;
          const rayon = 6 + ampl * Math.sin(tick / diviseur);
          const cx = COLS / 2;
          const cy = ROWS / 2;
          return grille((x, y) => {
            const dx = (x - cx) / 2;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < rayon - 3) return plein;
            if (dist < rayon) return mi;
            if (dist < rayon + 1) return bord;
            return ' ';
          });
        },
      };
    },
  });
}

function fabriqueVague(id, nom, tags, opts) {
  const { plein = '#', mi = '+', leger = '.', speed = 35, ampl = 4, freq = 5 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'mouvement',
    tags,
    duree_recommandee: 4000,
    creer() {
      let tick = 0;
      return {
        speed,
        step() {
          tick += 1;
          return grille((x, y) => {
            const centre = ROWS / 2 + ampl * Math.sin(x / freq + tick / 8);
            const distance = Math.abs(y - centre);
            if (distance < 0.6) return plein;
            if (distance < 1.4) return mi;
            if (distance < 2.2) return leger;
            return ' ';
          });
        },
      };
    },
  });
}

function fabriquePluie(id, nom, tags, opts) {
  const { chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', speed = 60 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'chute',
    tags,
    duree_recommandee: 4000,
    creer() {
      const colonnes = Array.from({ length: COLS }, () => Math.floor(Math.random() * ROWS * 2));
      return {
        speed,
        step() {
          const g = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
          for (let x = 0; x < COLS; x++) {
            const tete = colonnes[x];
            for (let trainee = 0; trainee < 7; trainee++) {
              const y = tete - trainee;
              if (y >= 0 && y < ROWS) {
                const car = chars[Math.floor(Math.random() * chars.length)];
                g[y][x] = trainee === 0 ? car : (trainee < 3 ? car : '.');
              }
            }
            colonnes[x] = (tete + 1) % (ROWS + 10);
          }
          return g.map((ligne) => ligne.join('')).join('\n');
        },
      };
    },
  });
}

function fabriqueRadar(id, nom, tags, opts) {
  const { speed = 28, rayon = 7.5, pas = 0.18 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'mouvement',
    tags,
    duree_recommandee: 4000,
    creer() {
      let angle = 0;
      return {
        speed,
        step() {
          angle += pas;
          const cx = COLS / 2;
          const cy = ROWS / 2;
          return grille((x, y) => {
            const dx = (x - cx) / 2;
            const dy = y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist > rayon) return ' ';
            const angleCase = Math.atan2(dy, dx);
            let ecart = angleCase - angle;
            while (ecart > Math.PI) ecart -= 2 * Math.PI;
            while (ecart < -Math.PI) ecart += 2 * Math.PI;
            if (ecart > 0 && ecart < 0.3) return '#';
            if (ecart >= 0.3 && ecart < 0.9) return '.';
            if (dist < 0.8) return '+';
            return ' ';
          });
        },
      };
    },
  });
}

function fabriqueEtoiles(id, nom, tags, opts) {
  const { densite = 0.08, speed = 100 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'bruit',
    tags,
    duree_recommandee: 4000,
    creer() {
      const etoiles = Array.from({ length: COLS * ROWS }, () => (Math.random() < densite ? Math.random() : null));
      let tick = 0;
      return {
        speed,
        step() {
          tick += 1;
          return grille((x, y) => {
            const i = y * COLS + x;
            const graine = etoiles[i];
            if (graine === null) return ' ';
            const phase = Math.sin(tick / 6 + graine * 20);
            if (phase > 0.6) return '*';
            if (phase > 0) return '.';
            return ' ';
          });
        },
      };
    },
  });
}

function fabriqueStatique(id, nom, tags, opts) {
  const { chars = ' .:-=+*#%@', speed = 45 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'bruit',
    tags,
    duree_recommandee: 3000,
    creer() {
      return {
        speed,
        step() {
          return grille(() => chars[Math.floor(Math.random() * chars.length)]);
        },
      };
    },
  });
}

function fabriqueBalayage(id, nom, tags, opts) {
  const { plein = '=', mi = '-', leger = '.', speed = 22 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'mouvement',
    tags,
    duree_recommandee: 3000,
    creer() {
      let y = 0;
      return {
        speed,
        step() {
          y = (y + 1) % (ROWS + 6);
          return grille((x, yy) => {
            const distance = Math.abs(yy - y);
            if (distance === 0) return plein;
            if (distance === 1) return mi;
            if (distance === 2) return leger;
            return ' ';
          });
        },
      };
    },
  });
}

function fabriqueChargement(id, nom, tags, opts) {
  const { label = 'CHARGEMENT', speed = 220 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'texte',
    tags,
    duree_recommandee: 3000,
    creer() {
      let tick = 0;
      return {
        speed,
        step() {
          tick += 1;
          const points = '.'.repeat(tick % 4);
          const largeurBarre = 30;
          const rempli = tick % (largeurBarre + 1);
          const barre = '#'.repeat(rempli) + '-'.repeat(largeurBarre - rempli);
          const lignes = Array(ROWS).fill(' '.repeat(COLS));
          lignes[Math.floor(ROWS / 2) - 1] = centrer(`${label}${points}`, COLS);
          lignes[Math.floor(ROWS / 2) + 1] = centrer(`[${barre}]`, COLS);
          return lignes.join('\n');
        },
      };
    },
  });
}

function fabriqueMachineEcrire(id, nom, tags, opts) {
  const { phrase, speed = 40 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'texte',
    tags,
    duree_recommandee: 4000,
    creer() {
      let index = 0;
      let pause = 0;
      return {
        speed,
        step() {
          if (index < phrase.length) {
            index += 1;
          } else {
            pause += 1;
            if (pause > 25) {
              index = 0;
              pause = 0;
            }
          }
          const curseur = pause % 10 < 5 ? '_' : ' ';
          const visible = phrase.slice(0, index) + (index < phrase.length ? curseur : (pause < 20 ? curseur : ''));
          const lignes = decouperEnLignes(visible, COLS - 4);
          const depart = Math.max(0, Math.floor(ROWS / 2) - Math.floor(lignes.length / 2));
          const grilleLignes = Array(ROWS).fill(' '.repeat(COLS));
          lignes.forEach((ligne, i) => {
            if (depart + i < ROWS) grilleLignes[depart + i] = centrer(ligne, COLS);
          });
          return grilleLignes.join('\n');
        },
      };
    },
  });
}

function fabriqueGenerique(id, nom, tags, opts) {
  const { texte, speed = 90 } = opts;
  enregistrer({
    id,
    nom,
    categorie: 'texte',
    tags,
    duree_recommandee: 4000,
    creer() {
      const lignes = decouperEnLignes(texte, COLS - 8);
      let offset = ROWS;
      return {
        speed,
        step() {
          offset -= 1;
          if (offset < -lignes.length) offset = ROWS;
          const grilleLignes = Array(ROWS).fill(' '.repeat(COLS));
          lignes.forEach((ligne, i) => {
            const y = offset + i;
            if (y >= 0 && y < ROWS) grilleLignes[y] = centrer(ligne, COLS);
          });
          return grilleLignes.join('\n');
        },
      };
    },
  });
}

fabriqueRespire('respire_lent', 'Respiration lente', ['calme', 'hibou', 'lent'], { speed: 80, diviseur: 22 });
fabriqueRespire('respire_rapide', 'Respiration rapide', ['stress', 'rapide'], { speed: 35, diviseur: 8 });
fabriqueRespire('respire_coeur', 'Pouls', ['coeur', 'vital'], { plein: 'v', mi: '+', bord: '.', speed: 60 });
fabriqueRespire('respire_hibou_oeil', 'Œil du hibou', ['hibou', 'regard'], { plein: 'O', mi: 'o', bord: '.', speed: 70 });
fabriqueRespire('respire_ample', 'Respiration ample', ['calme', 'large'], { ampl: 5, speed: 60 });
fabriqueRespire('respire_discrete', 'Respiration discrète', ['minimal'], { plein: '.', mi: ':', bord: ' ', speed: 90 });

fabriqueVague('vague_douce', 'Vague douce', ['calme', 'onde'], { speed: 55, ampl: 2 });
fabriqueVague('vague_forte', 'Vague forte', ['tempete', 'onde'], { speed: 25, ampl: 6 });
fabriqueVague('vague_binaire', 'Vague binaire', ['donnees', 'ia'], { plein: '1', mi: '0', leger: '.', speed: 40 });
fabriqueVague('vague_serree', 'Vague serrée', ['dense'], { freq: 2, speed: 35 });
fabriqueVague('vague_large', 'Vague large', ['ample'], { freq: 9, speed: 35 });

fabriquePluie('pluie_binaire', 'Pluie binaire', ['ia', 'chute', 'donnees', 'hibou'], { chars: '01', speed: 55 });
fabriquePluie('pluie_symboles', 'Pluie de symboles', ['glitch', 'chute'], { chars: '#@%&$+=*', speed: 60 });
fabriquePluie('pluie_hex', 'Pluie hexadécimale', ['code', 'chute'], { chars: '0123456789ABCDEF', speed: 50 });
fabriquePluie('pluie_lente', 'Pluie lente', ['calme', 'chute'], { speed: 100 });
fabriquePluie('pluie_dense', 'Pluie dense', ['dense', 'chute'], { speed: 30 });
fabriquePluie('pluie_points', 'Pluie de points', ['minimal', 'chute'], { chars: '.:', speed: 45 });

fabriqueRadar('radar_recherche', 'Radar de recherche', ['perdu', 'hibou', 'ia', 'recherche'], { speed: 24, rayon: 8 });
fabriqueRadar('radar_lent', 'Radar lent', ['calme', 'recherche'], { speed: 45, pas: 0.08 });
fabriqueRadar('radar_rapide', 'Radar rapide', ['urgence', 'recherche'], { speed: 16, pas: 0.3 });
fabriqueRadar('radar_petit', 'Radar compact', ['minimal'], { rayon: 4 });
fabriqueRadar('radar_grand', 'Radar large', ['ample'], { rayon: 8.9 });
fabriqueRadar('radar_double', 'Radar double vitesse', ['dynamique'], { speed: 20, pas: 0.25 });

fabriqueEtoiles('etoiles_espoir', 'Étoiles d\'espoir', ['espoir', 'hibou', 'nuit'], { densite: 0.1, speed: 90 });
fabriqueEtoiles('etoiles_rares', 'Étoiles rares', ['minimal', 'nuit'], { densite: 0.03, speed: 110 });
fabriqueEtoiles('etoiles_denses', 'Ciel étoilé dense', ['dense', 'nuit'], { densite: 0.15, speed: 90 });
fabriqueEtoiles('etoiles_lentes', 'Étoiles lentes', ['calme', 'nuit'], { speed: 160 });
fabriqueEtoiles('etoiles_rapides', 'Étoiles rapides', ['scintillement'], { speed: 50 });
fabriqueEtoiles('etoiles_geantes', 'Constellation', ['nuit', 'grand'], { densite: 0.05, speed: 90 });

fabriqueStatique('statique_fine', 'Statique fine', ['discret', 'glitch'], { chars: ' .:-', speed: 55 });
fabriqueStatique('statique_dense', 'Statique dense', ['glitch', 'chaos'], { chars: ' .:-=+*#%@', speed: 25 });
fabriqueStatique('statique_binaire', 'Statique binaire', ['ia', 'glitch'], { chars: ' 01', speed: 45 });
fabriqueStatique('statique_lente', 'Statique lente', ['calme', 'glitch'], { speed: 90 });
fabriqueStatique('statique_extreme', 'Statique extrême', ['chaos', 'urgence'], { speed: 15 });

fabriqueBalayage('balayage_lent', 'Balayage lent', ['calme', 'tv'], { speed: 45 });
fabriqueBalayage('balayage_rapide', 'Balayage rapide', ['urgence', 'tv'], { speed: 12 });
fabriqueBalayage('balayage_double', 'Balayage épais', ['vintage'], { plein: '#', mi: '=', leger: '-', speed: 22 });
fabriqueBalayage('balayage_binaire', 'Balayage binaire', ['ia', 'tv'], { plein: '1', mi: '0', leger: '.', speed: 30 });
fabriqueBalayage('balayage_minimal', 'Balayage minimal', ['minimal'], { plein: '.', mi: ' ', leger: ' ', speed: 22 });

fabriqueChargement('chargement_connexion', 'Connexion en cours', ['reseau', 'attente'], { label: 'CONNEXION' });
fabriqueChargement('chargement_analyse', 'Analyse en cours', ['ia', 'attente'], { label: 'ANALYSE' });
fabriqueChargement('chargement_sync', 'Synchronisation', ['reseau', 'attente'], { label: 'SYNCHRONISATION', speed: 180 });
fabriqueChargement('chargement_rapide', 'Chargement rapide', ['urgence', 'attente'], { speed: 100 });

fabriqueMachineEcrire('machine_erreur', 'Message erreur', ['ia', 'perdu', 'hibou'], { phrase: 'où suis-je ?' });
fabriqueMachineEcrire('machine_bienvenue', 'Message bienvenue', ['accueil'], { phrase: 'bienvenue.' });
fabriqueMachineEcrire('machine_recherche', 'Message recherche', ['ia'], { phrase: 'recherche du signal...' });
fabriqueMachineEcrire('machine_fin', 'Message fin', ['fin'], { phrase: 'fin de transmission.' });

fabriqueGenerique('generique_hibou', 'Générique hibou', ['film', 'hibou'], { texte: 'Le hibou perdu dans l\'IA' });
fabriqueGenerique('generique_credits', 'Générique de fin', ['film', 'fin'], { texte: 'Une production ServOMorph' });
fabriqueGenerique('generique_merci', 'Générique remerciements', ['film'], { texte: 'Merci d\'avoir regardé' });
