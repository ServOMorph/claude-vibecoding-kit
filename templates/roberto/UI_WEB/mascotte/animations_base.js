function texteSource() {
  const input = document.getElementById('texte-source');
  return input ? input.value : '';
}

enregistrer({
  id: 'hibou',
  nom: 'Hibou (mascotte)',
  categorie: 'vie',
  tags: ['hibou', 'mascotte', 'realiste', 'clignement'],
  duree_recommandee: 4000,
  creer() {
    let tick = 0;
    return {
      speed: 55,
      step() {
        tick += 1;
        const cx = COLS / 2;
        const cyCorps = ROWS / 2 + 1;
        const rx = 12;
        const ry = 6 + 0.5 * Math.sin(tick / 18);
        const decalageYeux = -3;
        const ecartYeux = 4.2;
        const rOeil = 2.1;
        const phaseClignement = tick % 90;
        const yeuxFermes = phaseClignement > 82;

        return grille((x, y) => {
          const dx = (x - cx) / 2;
          const dy = y - cyCorps;

          const dxOeilG = dx + ecartYeux;
          const dxOeilD = dx - ecartYeux;
          const dyOeil = dy - decalageYeux;
          const distOeilG = Math.sqrt(dxOeilG * dxOeilG + dyOeil * dyOeil);
          const distOeilD = Math.sqrt(dxOeilD * dxOeilD + dyOeil * dyOeil);
          const dansOeilG = distOeilG < rOeil;
          const dansOeilD = distOeilD < rOeil;

          if (dansOeilG || dansOeilD) {
            if (yeuxFermes) {
              return Math.abs(dyOeil) < 0.4 ? '-' : ' ';
            }
            const distCentre = dansOeilG ? distOeilG : distOeilD;
            if (distCentre < 0.7) return '@';
            if (distCentre < rOeil - 0.4) return 'O';
            return '.';
          }

          if (dy < decalageYeux + 0.5 && Math.abs(dx) < 1.1 && dy > decalageYeux - 1.3) {
            return 'v';
          }

          const distOreilleG = Math.abs((dx + rx * 0.55) - (dy - (-ry - 1)) * -0.6);
          const distOreilleD = Math.abs((dx - rx * 0.55) - (dy - (-ry - 1)) * 0.6);
          const zoneOreilleY = dy > -ry - 3 && dy < -ry + 0.5;
          if (zoneOreilleY) {
            if (dx < 0 && distOreilleG < 0.6) return '/';
            if (dx > 0 && distOreilleD < 0.6) return '\\';
          }

          const ellipseCorps = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
          if (ellipseCorps <= 1) {
            if (ellipseCorps < 0.55) return '@';
            if (ellipseCorps < 0.85) return '*';
            return '.';
          }

          const dyPied = y - (cyCorps + ry);
          if (dyPied >= 0 && dyPied < 1.4 && (Math.abs(dx + 3) < 0.6 || Math.abs(dx - 3) < 0.6)) {
            return 'V';
          }

          return ' ';
        });
      },
    };
  },
});

enregistrer({
  id: 'respire',
  nom: 'Respiration',
  categorie: 'vie',
  tags: ['calme', 'hibou', 'coeur', 'lent'],
  duree_recommandee: 4000,
  creer() {
    let tick = 0;
    return {
      speed: 55,
      step() {
        tick += 1;
        const rayon = 6 + 3 * Math.sin(tick / 16);
        const cx = COLS / 2;
        const cy = ROWS / 2;
        return grille((x, y) => {
          const dx = (x - cx) / 2;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < rayon - 3) return '@';
          if (dist < rayon) return '*';
          if (dist < rayon + 1) return '.';
          return ' ';
        });
      },
    };
  },
});

enregistrer({
  id: 'vague',
  nom: 'Vague',
  categorie: 'mouvement',
  tags: ['fluide', 'onde'],
  duree_recommandee: 4000,
  creer() {
    let tick = 0;
    return {
      speed: 35,
      step() {
        tick += 1;
        return grille((x, y) => {
          const centre = ROWS / 2 + 4 * Math.sin(x / 5 + tick / 8);
          const distance = Math.abs(y - centre);
          if (distance < 0.6) return '#';
          if (distance < 1.4) return '+';
          if (distance < 2.2) return '.';
          return ' ';
        });
      },
    };
  },
});

enregistrer({
  id: 'pluie',
  nom: 'Pluie de caractères',
  categorie: 'chute',
  tags: ['matrix', 'chute', 'donnees'],
  duree_recommandee: 4000,
  creer() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const colonnes = Array.from({ length: COLS }, () => Math.floor(Math.random() * ROWS * 2));
    return {
      speed: 60,
      step() {
        const g = Array.from({ length: ROWS }, () => Array(COLS).fill(' '));
        for (let x = 0; x < COLS; x++) {
          const tete = colonnes[x];
          for (let trainee = 0; trainee < 7; trainee++) {
            const y = tete - trainee;
            if (y >= 0 && y < ROWS) {
              const car = chars[Math.floor(Math.random() * chars.length)];
              g[y][x] = trainee === 0 ? car : (trainee < 3 ? car.toLowerCase() : '.');
            }
          }
          colonnes[x] = (tete + 1) % (ROWS + 10);
        }
        return g.map((ligne) => ligne.join('')).join('\n');
      },
    };
  },
});

enregistrer({
  id: 'radar',
  nom: 'Radar',
  categorie: 'mouvement',
  tags: ['recherche', 'rotation', 'balayage'],
  duree_recommandee: 4000,
  creer() {
    let angle = 0;
    return {
      speed: 28,
      step() {
        angle += 0.18;
        const cx = COLS / 2;
        const cy = ROWS / 2;
        return grille((x, y) => {
          const dx = (x - cx) / 2;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 7.5) return ' ';
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

enregistrer({
  id: 'etoiles',
  nom: 'Étoiles',
  categorie: 'bruit',
  tags: ['nuit', 'scintillement', 'espoir'],
  duree_recommandee: 4000,
  creer() {
    const etoiles = Array.from({ length: COLS * ROWS }, () => (Math.random() < 0.08 ? Math.random() : null));
    let tick = 0;
    return {
      speed: 100,
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

enregistrer({
  id: 'statique',
  nom: 'Statique TV',
  categorie: 'bruit',
  tags: ['glitch', 'vintage', 'interference'],
  duree_recommandee: 3000,
  creer() {
    const chars = ' .:-=+*#%@';
    return {
      speed: 45,
      step() {
        return grille(() => chars[Math.floor(Math.random() * chars.length)]);
      },
    };
  },
});

enregistrer({
  id: 'balayage',
  nom: 'Balayage',
  categorie: 'mouvement',
  tags: ['scan', 'tv', 'vintage'],
  duree_recommandee: 3000,
  creer() {
    let y = 0;
    return {
      speed: 22,
      step() {
        y = (y + 1) % (ROWS + 6);
        return grille((x, yy) => {
          const distance = Math.abs(yy - y);
          if (distance === 0) return '=';
          if (distance === 1) return '-';
          if (distance === 2) return '.';
          return ' ';
        });
      },
    };
  },
});

enregistrer({
  id: 'chargement',
  nom: 'Chargement',
  categorie: 'texte',
  tags: ['barre', 'progression', 'attente'],
  duree_recommandee: 3000,
  creer() {
    let tick = 0;
    return {
      speed: 220,
      step() {
        tick += 1;
        const points = '.'.repeat(tick % 4);
        const largeurBarre = 30;
        const rempli = tick % (largeurBarre + 1);
        const barre = '#'.repeat(rempli) + '-'.repeat(largeurBarre - rempli);
        const texte = `CHARGEMENT${points}`;
        const lignes = Array(ROWS).fill(' '.repeat(COLS));
        lignes[Math.floor(ROWS / 2) - 1] = centrer(texte, COLS);
        lignes[Math.floor(ROWS / 2) + 1] = centrer(`[${barre}]`, COLS);
        return lignes.join('\n');
      },
    };
  },
});

enregistrer({
  id: 'machine_ecrire',
  nom: 'Machine à écrire',
  categorie: 'texte',
  tags: ['typewriter', 'message', 'personnalisable'],
  duree_recommandee: 4000,
  creer() {
    let texte = '';
    let index = 0;
    let pause = 0;
    return {
      speed: 40,
      reset() {
        texte = texteSource();
        index = 0;
        pause = 0;
      },
      step() {
        if (index < texte.length) {
          index += 1;
        } else {
          pause += 1;
          if (pause > 25) {
            index = 0;
            pause = 0;
          }
        }
        const curseur = pause % 10 < 5 ? '_' : ' ';
        const visible = texte.slice(0, index) + (index < texte.length ? curseur : (pause < 20 ? curseur : ''));
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

enregistrer({
  id: 'generique',
  nom: 'Générique défilant',
  categorie: 'texte',
  tags: ['credits', 'film', 'scroll', 'personnalisable'],
  duree_recommandee: 4000,
  creer() {
    let lignes = [''];
    let offset = ROWS;
    return {
      speed: 90,
      reset() {
        lignes = decouperEnLignes(texteSource(), COLS - 8);
        offset = ROWS;
      },
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
