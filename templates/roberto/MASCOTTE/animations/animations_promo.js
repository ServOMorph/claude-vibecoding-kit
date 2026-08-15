enregistrer({
  id: 'promo_linkedin',
  nom: 'Promo LinkedIn Serenia-Tech',
  categorie: 'histoire',
  tags: ['promo', 'linkedin', 'serenia', 'communication'],
  duree_recommandee: 16000,
  creer() {
    let tick = 0;

    // Le hibou simplifié de face pour les scènes avec le hibou
    function dessinerHibouPromo(x, y, tickOffset) {
      const cx = COLS / 2;
      const cy = ROWS / 2 + 1;
      const rx = 10;
      const ry = 6;
      const dx = (x - cx) / 2;
      const dy = y - cy;
      const corps = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);

      if (corps < 1) {
        // Yeux
        const oeilX = 4;
        const oeilY = cy - 2;
        if (Math.abs(y - oeilY) < 1.2 && (Math.abs(x - (cx - oeilX)) < 1.8 || Math.abs(x - (cx + oeilX)) < 1.8)) {
          const yeuxFermes = (tickOffset % 80) > 74;
          if (yeuxFermes) return '-';
          return '@';
        }
        // Bec
        if (y === cy && Math.abs(x - cx) < 1) return 'v';
        // Plumes
        if (dy > 0 && (x + y) % 3 === 0) return 'V';
        return '*';
      }
      return null;
    }

    function bruitPromo(x, y, t, decalage = 0) {
      const valeur = Math.sin((x + 12.98) * 12.9898 + (y + 4.13) * 78.233 + (t + decalage) * 0.17) * 43758.5453;
      return valeur - Math.floor(valeur);
    }

    return {
      speed: 60, // ~16 frames par seconde
      step() {
        tick += 1;
        const tempsS = (tick * 60) / 1000; // temps en secondes

        return grilleEclairee((x, y) => {
          // Phase 1 : Démarrage système (0 à 3s)
          if (tempsS < 3) {
            const chargementTick = Math.floor(tempsS * 10) % 4;
            const points = '.'.repeat(chargementTick);
            const titre = '>>> SERENIA TECH TERMINAL <<<';
            const msg1 = `System initialization${points}`;
            const msg2 = '> LOADING NEURAL MAPPING...';
            const progress = Math.min(100, Math.floor((tempsS / 3) * 100));
            const progressStr = `[${'#'.repeat(Math.floor(progress / 10))}${'-'.repeat(10 - Math.floor(progress / 10))}] ${progress}%`;

            if (y === 2) return { car: centrerExact(titre, COLS)[x], lum: 8 };
            if (y === 6) return { car: centrerExact(msg1, COLS)[x], lum: 6 };
            if (tempsS > 1.2 && y === 9) return { car: centrerExact(msg2, COLS)[x], lum: 6 };
            if (tempsS > 1.8 && y === 12) return { car: centrerExact(progressStr, COLS)[x], lum: 8 };

            // Bruit de fond
            if (bruitPromo(x, y, tick) > 0.99) return { car: '.', lum: 2 };
            return { car: ' ', lum: 0 };
          }

          // Phase 2 : Révélation du Hibou & Slogan (3 à 7s)
          else if (tempsS < 7) {
            // Dessiner le hibou décalé à gauche (on translate x de 12 vers la gauche)
            const carHibou = dessinerHibouPromo(x + 12, y, tick);
            if (carHibou) {
              const lum = y < ROWS / 2 ? 7 : 5;
              return { car: carHibou, lum };
            }

            // Texte à droite
            if (y === 6 && x >= 30 && x < 58) {
              const txt = '   L\'ALLIANCE DE   ';
              const idx = x - 30;
              return { car: txt[idx] || ' ', lum: 6 };
            }
            if (y === 8 && x >= 30 && x < 58) {
              const txt = '  LA TECHNOLOGIE   ';
              const idx = x - 30;
              return { car: txt[idx] || ' ', lum: 8 };
            }
            if (y === 10 && x >= 30 && x < 58) {
              const txt = '   ET DE LA SAGESSE ';
              const idx = x - 30;
              return { car: txt[idx] || ' ', lum: 6 };
            }

            // Décoration d'étoiles
            if (bruitPromo(x, y, tick) > 0.97) return { car: Math.sin(tick * 0.1 + x) > 0 ? '*' : '.', lum: 3 };
            return { car: ' ', lum: 0 };
          }

          // Phase 3 : Vos solutions sur-mesure (7 à 11s)
          else if (tempsS < 11) {
            // Onde sinusoïdale de réseau
            const onde = Math.sin(x * 0.3 + tempsS * 5) * 4;
            const centreY = ROWS / 2;
            const distOnde = Math.abs(y - (centreY + Math.round(onde)));

            if (distOnde < 1) {
              return { car: '#', lum: 8 };
            } else if (distOnde < 2) {
              return { car: '+', lum: 5 };
            } else if (distOnde < 3) {
              return { car: '.', lum: 2 };
            }

            // Texte superposé
            const ligneTextes = {
              4: '  [ SOLUTIONS IA SUR-MESURE ]  ',
              13: '    POUR TOUS VOS PROJETS     '
            };

            const txt = ligneTextes[y];
            if (txt) {
              const startX = Math.floor((COLS - txt.length) / 2);
              if (x >= startX && x < startX + txt.length) {
                return { car: txt[x - startX], lum: 9 };
              }
            }

            return { car: ' ', lum: 0 };
          }

          // Phase 4 : Logo final & Lien Site Web (11 à 16s)
          else {
            const cadreXDebut = 6;
            const cadreXFin = 53;
            const cadreYDebut = 2;
            const cadreYFin = 15;

            const dansCadre = x >= cadreXDebut && x <= cadreXFin && y >= cadreYDebut && y <= cadreYFin;
            const bordX = x === cadreXDebut || x === cadreXFin;
            const bordY = y === cadreYDebut || y === cadreYFin;

            if (dansCadre && (bordX || bordY)) {
              // Eclairage tournant sur le cadre
              const phaseCadre = Math.floor((x + y + tick) / 3) % 4;
              const carCadre = (bordX && bordY) ? '+' : (bordY ? '-' : '|');
              return { car: carCadre, lum: phaseCadre === 0 ? 9 : 6 };
            }

            if (dansCadre) {
              if (y === 4) return { car: centrerExact('S E R E N I A   T E C H', COLS)[x], lum: 9 };
              if (y === 6) return { car: centrerExact('Intelligence Sereine', COLS)[x], lum: 7 };
              if (y === 9) return { car: centrerExact('Découvrez nos services :', COLS)[x], lum: 5 };
              if (y === 11) {
                const url = 'www.serenia-tech.fr';
                const clignote = Math.floor(tempsS * 2) % 2 === 0;
                return { car: centrerExact(url, COLS)[x], lum: clignote ? 9 : 8 };
              }
            }

            // Pluie binaire
            if (!dansCadre && (x + y * 2) % 7 === 0) {
              const bit = (x + y + Math.floor(tick / 5)) % 2;
              return { car: bit.toString(), lum: 2 };
            }

            return { car: ' ', lum: 0 };
          }
        });
      }
    };
  }
});

// Ajouter au montage global la promo LinkedIn
MONTAGES.promo_linkedin_clip = {
  nom: 'Promo LinkedIn — SérénIA Tech',
  duree_totale: 16000,
  etapes: [
    { id: 'promo_linkedin', duree: 16000, sousTitre: '' }
  ]
};

// Nouvelle animation explosive et spectaculaire
enregistrer({
  id: 'promo_explosive',
  nom: 'Promo Explosive Serenia-Tech',
  categorie: 'histoire',
  tags: ['promo', 'linkedin', 'explosive', 'cyberpunk', 'serenia'],
  duree_recommandee: 15000,
  creer() {
    let tick = 0;

    // Fonction de bruit pseudo-aléatoire
    function bruit(x, y, t) {
      const v = Math.sin(x * 12.9898 + y * 78.233 + t * 0.15) * 43758.5453;
      return v - Math.floor(v);
    }

    // Dessin du hibou
    function dessinerHibou(x, y, cx, cy, phase) {
      const dx = (x - cx) / 1.8;
      const dy = y - cy;
      const dist = dx * dx + dy * dy;

      if (dist < 12) {
        // Yeux du hibou
        const oeilX = 3;
        const oeilY = cy - 1;
        if (y === oeilY && (x === cx - oeilX || x === cx + oeilX)) {
          const eclat = Math.floor(phase * 3) % 2;
          return { car: eclat ? '@' : 'O', lum: 9 };
        }
        // Sourcils
        if (y === cy - 2 && (Math.abs(x - cx) === 2 || Math.abs(x - cx) === 4)) {
          return { car: x < cx ? '\\' : '/', lum: 7 };
        }
        // Bec
        if (y === cy && x === cx) return { car: 'v', lum: 8 };
        // Corps
        const plumage = (x + y + Math.floor(phase)) % 3;
        const carPlume = plumage === 0 ? 'V' : (plumage === 1 ? '*' : '{');
        return { car: carPlume, lum: 5 };
      }
      return null;
    }

    return {
      speed: 50,
      step() {
        tick += 1;
        const tempsS = (tick * 50) / 1000;
        
        return grilleEclairee((x, y) => {
          const cx = COLS / 2;
          const cy = ROWS / 2;
          const dx = x - cx;
          const dy = y - cy;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // PHASE 1 : L'Implosion (0s à 2s)
          if (tempsS < 2.0) {
            const ratio = tempsS / 2.0;
            const rayonImplosion = 30 * (1 - ratio);
            const angle = Math.atan2(dy, dx) + ratio * 8;
            const distParticule = Math.abs(distance - rayonImplosion);
            
            if (distParticule < 1.5 && bruit(x, y, tick) > 0.4) {
              const chars = ['+', '*', '.', '0', '1', 'x'];
              const charIdx = Math.floor(bruit(x, y, tick) * chars.length);
              return { car: chars[charIdx], lum: Math.round(5 + ratio * 4) };
            }
            if (distance < 2 + ratio * 4) {
              return { car: '#', lum: Math.round(4 + ratio * 5) };
            }
            return { car: ' ', lum: 0 };
          }

          // PHASE 2 : L'Explosion Supernova (2s à 4s)
          else if (tempsS < 4.0) {
            const tExp = tempsS - 2.0;
            const vitesseOnde = 40;
            const rayonOnde = tExp * vitesseOnde;
            const epaisseurOnde = 3 - tExp * 0.8;
            const diffOnde = Math.abs(distance - rayonOnde);
            
            if (tExp < 0.2) {
              const chanceFlash = 0.9 - tExp * 3;
              if (bruit(x, y, tick) < chanceFlash) {
                return { car: '#', lum: 9 };
              }
            }
            if (diffOnde < epaisseurOnde) {
              const intensite = Math.max(1, Math.round(9 - tExp * 3));
              const charsOnde = ['@', 'O', '%', '*', '+', '.', ' '];
              const charIdx = Math.min(charsOnde.length - 1, Math.floor(diffOnde * (charsOnde.length / epaisseurOnde)));
              return { car: charsOnde[charIdx], lum: intensite };
            }
            if (distance < rayonOnde && bruit(x, y, tick) > 0.93 - tExp * 0.1) {
              return { car: Math.random() > 0.5 ? '*' : '.', lum: Math.max(2, Math.round(7 - tExp * 3)) };
            }
            return { car: ' ', lum: 0 };
          }

          // PHASE 3 : Émergence du Logo (4s à 7.5s)
          else if (tempsS < 7.5) {
            const tLogo = tempsS - 4.0;
            const perspectiveY = y / ROWS;
            const ligneGrille = Math.floor(y + tick * 0.4) % 4 === 0;
            const colGrille = Math.floor(Math.abs(dx) * (1 / (perspectiveY + 0.1)) + tick * 0.1) % 6 === 0;
            
            let bgCar = ' ';
            let bgLum = 0;
            if ((ligneGrille || colGrille) && y > 10) {
              bgCar = '.';
              bgLum = Math.round(1 + perspectiveY * 2.5);
            }
            
            const titre = "S E R E N I A   T E C H";
            const slogan = "L'INTELLIGENCE ARTIFICIELLE NATIVE";
            const affichageProgressif = Math.floor(tLogo * 6);
            
            if (y === 5) {
              const startX = Math.floor((COLS - titre.length) / 2);
              if (x >= startX && x < startX + titre.length) {
                const charIdx = x - startX;
                if (charIdx < affichageProgressif) {
                  const estGlitch = bruit(x, y, tick) > 0.96;
                  const car = estGlitch ? ALPHABET_CRYPTAGE_CODEX[Math.floor(bruit(x, y, tick) * 8)] : titre[charIdx];
                  const lum = estGlitch ? 9 : 8;
                  return { car, lum };
                }
              }
            }
            if (y === 7 && tLogo > 1.2) {
              const startX = Math.floor((COLS - slogan.length) / 2);
              if (x >= startX && x < startX + slogan.length) {
                const charIdx = x - startX;
                if (charIdx < Math.floor((tLogo - 1.2) * 10)) {
                  return { car: slogan[charIdx], lum: 6 };
                }
              }
            }
            
            const balayageX = Math.floor((tick * 1.5) % (COLS + 20)) - 10;
            if (Math.abs(x - balayageX) < 2) {
              return { car: '|', lum: 3 };
            }
            if (bgLum > 0) return { car: bgCar, lum: bgLum };
            return { car: ' ', lum: 0 };
          }

          // PHASE 4 : Le Hibou Scan Laser (7.5s à 11s)
          else if (tempsS < 11.0) {
            const tHibou = tempsS - 7.5;
            const laserX = Math.floor(tHibou * 25);
            const estScanLaser = Math.abs(x - laserX) < 1.5;
            const carHibou = dessinerHibou(x, y, 18, 9, tick * 0.1);
            
            if (carHibou) {
              if (estScanLaser) return { car: '#', lum: 9 };
              return { car: carHibou.car, lum: Math.max(carHibou.lum, x < laserX ? 7 : 4) };
            }
            
            const lignesService = {
              5: " > ALGORITHMES ",
              7: " > APPLICATIONS",
              9: " > INTEGRATIONS",
              11: " > AUDITS / IA  "
            };
            
            const texteSvc = lignesService[y];
            if (texteSvc && x >= 34 && x < 34 + texteSvc.length) {
              const charIdx = x - 34;
              const delay = (y - 5) * 0.2;
              if (tHibou > delay) {
                const visibleLen = Math.floor((tHibou - delay) * 12);
                if (charIdx < visibleLen) {
                  return { car: texteSvc[charIdx], lum: 7 };
                }
              }
            }
            if (estScanLaser) {
              return { car: '|', lum: 8 };
            }
            if (bruit(x, y, tick) > 0.98) return { car: '0', lum: 2 };
            return { car: ' ', lum: 0 };
          }

          // PHASE 5 : Final & Lien Site Web (11s à 15s)
          else {
            const tFinal = tempsS - 11.0;
            const freq = Math.sin(x * 0.25 - tick * 0.15) * 3;
            const centreOscillo = 13;
            const distOscillo = Math.abs(y - (centreOscillo + Math.round(freq)));
            
            let oscilloCar = ' ';
            let oscilloLum = 0;
            if (distOscillo < 1) {
              oscilloCar = '~';
              oscilloLum = 4;
            } else if (distOscillo < 2) {
              oscilloCar = '.';
              oscilloLum = 2;
            }
            
            const bordGauche = 4;
            const bordDroite = 55;
            const bordHaut = 1;
            const bordBas = 16;
            
            const dansCadre = x >= bordGauche && x <= bordDroite && y >= bordHaut && y <= bordBas;
            const estCoin = (x === bordGauche || x === bordDroite) && (y === bordHaut || y === bordBas);
            const estBordure = (x === bordGauche || x === bordDroite || y === bordHaut || y === bordBas);
            
            if (dansCadre && estBordure) {
              const lumImpulsion = Math.floor(tFinal * 4) % 2 === 0 ? 8 : 6;
              return { car: estCoin ? '+' : (x === bordGauche || x === bordDroite ? '|' : '-'), lum: lumImpulsion };
            }
            if (dansCadre) {
              if (y === 5) return { car: centrerExact("S E R E N I A   T E C H", COLS)[x], lum: 9 };
              if (y === 8) return { car: centrerExact("L'IA AU SERVICE DE VOS SOLUTIONS", COLS)[x], lum: 7 };
              if (y === 11) {
                const url = "www.serenia-tech.fr";
                const clignote = Math.floor(tick / 4) % 2 === 0;
                return { car: centrerExact(url, COLS)[x], lum: clignote ? 9 : 5 };
              }
              if (y === 13) {
                const progress = Math.min(16, Math.floor(tFinal * 5));
                const barre = `[${'#'.repeat(progress)}${'.'.repeat(16 - progress)}]`;
                return { car: centrerExact(barre, COLS)[x], lum: 6 };
              }
            }
            if (!dansCadre && (x + y * 2 + Math.floor(tick / 4)) % 9 === 0) {
              return { car: bruit(x, y, tick) > 0.5 ? '1' : '0', lum: 3 };
            }
            if (oscilloLum > 0) return { car: oscilloCar, lum: oscilloLum };
            return { car: ' ', lum: 0 };
          }
        });
      }
    };
  }
});

// Ajouter au montage global la promo Explosive
MONTAGES.promo_explosive_clip = {
  nom: 'Promo Explosive — SérénIA Tech',
  duree_totale: 15000,
  etapes: [
    { id: 'promo_explosive', duree: 15000, sousTitre: '' }
  ]
};
