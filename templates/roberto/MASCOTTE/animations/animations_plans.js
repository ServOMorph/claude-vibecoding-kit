function dessinerHibouCadre(tick, cam) {
  const echelle = cam.echelle;
  const ambiante = cam.ambiante ?? 0.32;
  const cx = COLS / 2 + cam.offX;
  const respiration = 1 + 0.018 * Math.sin(tick / 18);
  const cyCorps = 11.8 + cam.offY;
  const rx = 15 * echelle * respiration;
  const ry = 10.2 * echelle * respiration;
  const decalageYeux = -5.4 * echelle;
  const ecartYeux = 5.75 * echelle;
  const rxOeil = 4.45 * echelle;
  const ryOeil = 3.25 * echelle;
  // Même en plan d'ensemble, les aigrettes gardent deux lignes lisibles.
  const echelleAigrette = Math.max(echelle, 0.55);
  const phaseClignement = tick % 90;
  const yeuxFermes = cam.yeuxClignotants !== false && phaseClignement > 82;

  return grilleEclairee((x, y) => {
    const dx = (x - cx) / 2;
    const dy = y - cyCorps;

    const dxOeilG = dx + ecartYeux;
    const dxOeilD = dx - ecartYeux;
    const dyOeil = dy - decalageYeux;
    const distOeilG = Math.sqrt((dxOeilG * dxOeilG) / (rxOeil * rxOeil) + (dyOeil * dyOeil) / (ryOeil * ryOeil));
    const distOeilD = Math.sqrt((dxOeilD * dxOeilD) / (rxOeil * rxOeil) + (dyOeil * dyOeil) / (ryOeil * ryOeil));
    const dansOeilG = distOeilG < 1;
    const dansOeilD = distOeilD < 1;

    if (dansOeilG || dansOeilD) {
      if (yeuxFermes) {
        return { car: Math.abs(dyOeil) < 0.28 * echelle ? '-' : ' ', lum: 5 };
      }
      const distCentre = dansOeilG ? distOeilG : distOeilD;
      const dxOeil = dansOeilG ? dxOeilG : dxOeilD;
      const u = dxOeil / rxOeil;
      const v = dyOeil / ryOeil;
      const lumOeil = CONFIG_RENDU.eclairageDirectionnel
        ? calculerLumiere(u, v, Math.sqrt(Math.max(0, 1 - u * u - v * v)), ambiante + 0.2)
        : 5;
      const reflet = Math.sqrt((u + 0.25) * (u + 0.25) + (v + 0.32) * (v + 0.32));
      if (reflet < 0.18) return { car: '*', lum: 9 };
      if (distCentre < 0.38) return { car: '@', lum: 1 };
      if (distCentre < 0.68) return { car: ' ', lum: 0 };
      if (distCentre < 0.88) return { car: 'O', lum: 8 };
      return { car: '.', lum: lumOeil };
    }

    if (dy < decalageYeux + 4.8 * echelle && Math.abs(dx) < 0.85 * echelle && dy > decalageYeux + 2.2 * echelle) {
      return { car: 'v', lum: CONFIG_RENDU.eclairageDirectionnel ? Math.round(ambiante * 9) : 5 };
    }

    // Deux aigrettes pleines, attachées aux côtés du crâne : visibles à toutes les échelles.
    const hautAigrette = -10.5 * echelleAigrette;
    const basAigrette = -4.25 * echelleAigrette;
    if (dy >= hautAigrette && dy <= basAigrette) {
      const progressionAigrette = (dy - hautAigrette) / (basAigrette - hautAigrette);
      const centreAigrette = (11.1 - 3.1 * progressionAigrette) * echelleAigrette;
      const demiLargeurAigrette = 0.32 + 2.35 * progressionAigrette;
      const gauche = Math.abs(dx + centreAigrette) <= demiLargeurAigrette;
      const droite = Math.abs(dx - centreAigrette) <= demiLargeurAigrette;
      if (gauche || droite) {
        const bord = Math.abs(Math.abs(dx) - centreAigrette) > demiLargeurAigrette - 0.5;
        const car = bord ? (gauche ? '/' : '\\') : '^';
        const lumAigrette = CONFIG_RENDU.eclairageDirectionnel
          ? (gauche ? Math.max(5, Math.round(ambiante * 9) + 2) : Math.max(3, Math.round(ambiante * 9)))
          : 5;
        return { car, lum: lumAigrette };
      }
    }

    const ellipseCorps = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry);
    if (ellipseCorps <= 1) {
      let lum = 5;
      if (CONFIG_RENDU.eclairageDirectionnel) {
        const u = dx / rx;
        const v = dy / ry;
        const nz = Math.sqrt(Math.max(0, 1 - u * u - v * v));
        lum = calculerLumiere(u, v, nz, ambiante);
      }
      const plume = Math.abs(Math.round(dx * 1.3)) + Math.abs(Math.round((dy - 2.4 * echelle) * 1.25));
      if (dy > 0.2 * echelle && dy < 5.2 * echelle && plume % 4 === 0) return { car: 'V', lum: Math.max(3, lum - 1) };
      if (Math.abs(dx) > 8 * echelle && dy > -1.5 * echelle && plume % 3 === 0) return { car: '/', lum: Math.max(2, lum - 2) };
      if (ellipseCorps < 0.5) return { car: '@', lum };
      if (ellipseCorps < 0.78) return { car: '*', lum };
      return { car: '.', lum };
    }

    const dyPied = y - (cyCorps + ry);
    const piedOffset = rx * 0.25;
    if (dyPied >= 0 && dyPied < 1.4 * echelle && (Math.abs(dx + piedOffset) < 0.6 * echelle || Math.abs(dx - piedOffset) < 0.6 * echelle)) {
      return { car: 'V', lum: CONFIG_RENDU.eclairageDirectionnel ? Math.round(ambiante * 9) : 5 };
    }

    return { car: ' ', lum: 0 };
  });
}

function fabriqueHibouPlan(id, nom, tags, config) {
  const {
    dureeBoucle = 3000,
    speed = 55,
    echelleDebut = 1,
    echelleFin = echelleDebut,
    offXDebut = 0,
    offXFin = offXDebut,
    offYDebut = 0,
    offYFin = offYDebut,
    yeuxClignotants = true,
    ambiante = 0.32,
  } = config;
  enregistrer({
    id,
    nom,
    categorie: 'plan',
    tags,
    duree_recommandee: dureeBoucle,
    creer() {
      let tick = 0;
      let tempsEcoule = 0;
      return {
        speed,
        step() {
          tick += 1;
          tempsEcoule += speed;
          const progres = (tempsEcoule % dureeBoucle) / dureeBoucle;
          const echelle = echelleDebut + (echelleFin - echelleDebut) * progres;
          const offX = offXDebut + (offXFin - offXDebut) * progres;
          const offY = offYDebut + (offYFin - offYDebut) * progres;
          return dessinerHibouCadre(tick, { echelle, offX, offY, yeuxClignotants, ambiante });
        },
      };
    },
  });
}

fabriqueHibouPlan('plan_ensemble', 'Plan d\'ensemble', ['cinema', 'hibou', 'large', 'etablissement'], {
  dureeBoucle: 3000,
  echelleDebut: 0.35,
  offYDebut: -3,
});

fabriqueHibouPlan('plan_large', 'Plan large', ['cinema', 'hibou'], {
  dureeBoucle: 3000,
  echelleDebut: 0.85,
});

fabriqueHibouPlan('panoramique', 'Panoramique', ['cinema', 'hibou', 'mouvement-camera'], {
  dureeBoucle: 3000,
  echelleDebut: 0.85,
  offXDebut: -14,
  offXFin: 14,
});

fabriqueHibouPlan('plan_moyen', 'Plan moyen', ['cinema', 'hibou'], {
  dureeBoucle: 3000,
  echelleDebut: 1.3,
  offYDebut: 5,
});

fabriqueHibouPlan('travelling_avant', 'Travelling avant', ['cinema', 'hibou', 'mouvement-camera', 'zoom'], {
  dureeBoucle: 4000,
  echelleDebut: 0.9,
  echelleFin: 2.2,
  offYFin: 5.5,
});

fabriqueHibouPlan('gros_plan', 'Gros plan', ['cinema', 'hibou'], {
  dureeBoucle: 3000,
  echelleDebut: 2.4,
  offYDebut: 7.2,
});

fabriqueHibouPlan('tres_gros_plan_oeil', 'Très gros plan (œil)', ['cinema', 'hibou', 'insert'], {
  dureeBoucle: 3000,
  echelleDebut: 4.5,
  offXDebut: 8.4 * 4.5,
  offYDebut: 5.4 * 4.5,
});

fabriqueHibouPlan('contre_plongee', 'Contre-plongée', ['cinema', 'hibou', 'angle'], {
  dureeBoucle: 3000,
  echelleDebut: 1.6,
  offYDebut: 5.4,
});

fabriqueHibouPlan('plongee', 'Plongée', ['cinema', 'hibou', 'angle'], {
  dureeBoucle: 3000,
  echelleDebut: 0.55,
  offYDebut: -6,
});
