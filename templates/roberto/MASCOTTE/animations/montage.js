window.MONTAGES = window.MONTAGES || {};
Object.assign(window.MONTAGES, {
  hibou_plans_cinema: {
    nom: 'Plans du hibou',
    duree_totale: 34500,
    etapes: [
      { id: 'plan_ensemble', duree: 3000, sousTitre: 'Nuit calme. Le hibou observe au loin.' },
      { id: 'plan_large', duree: 3000, sousTitre: 'Il est perché, immobile.' },
      { id: 'panoramique', duree: 3000, sousTitre: 'Un bruit attire son attention.' },
      { id: 'plan_moyen', duree: 3000, sousTitre: 'Il se penche vers le cadre.' },
      { id: 'travelling_avant', duree: 4000, sousTitre: 'Il s\'approche, curieux.' },
      { id: 'gros_plan', duree: 3000, sousTitre: 'Son regard se fixe.' },
      { id: 'tres_gros_plan_oeil', duree: 3000, sousTitre: 'Quelque chose brille dans son œil.' },
      { id: 'contre_plongee', duree: 3000, sousTitre: 'Il se redresse, impressionnant.' },
      { id: 'plongee', duree: 2000, sousTitre: 'Puis se fait tout petit, prudent.' },
      { id: 'plan_large', duree: 3000, sousTitre: 'Il repart dans la nuit.' },
      { id: 'logo_serenia_codex', duree: 2500, sousTitre: '' },
      { id: 'ecran_noir', duree: 2000, sousTitre: '' },
    ],
  },
  hibou_perdu_ia_codex: {
    nom: 'Le hibou perdu dans l\'IA — Codex',
    duree_totale: 35500,
    etapes: [
      { id: 'codex_veille', duree: 4000, sousTitre: 'Une nuit tranquille. Le hibou veille.' },
      { id: 'codex_signal', duree: 3000, sousTitre: 'Un signal inconnu fend le silence.' },
      { id: 'codex_chute', duree: 5000, sousTitre: 'Le flux de données se referme autour de lui.' },
      { id: 'codex_recherche', duree: 5000, sousTitre: 'Une balise cherche le hibou dans le noir.' },
      { id: 'codex_erreur', duree: 4000, sousTitre: 'Le terminal attend une réponse.' },
      { id: 'codex_espoir', duree: 4000, sousTitre: 'Une lumière répond enfin.' },
      { id: 'codex_veille', duree: 5000, sousTitre: 'Le hibou retrouve le calme de son nid.' },
      { id: 'logo_serenia_codex', duree: 3500, sousTitre: '' },
      { id: 'ecran_noir', duree: 2000, sousTitre: '' },
    ],
  },
  logo_serenia_clip_codex: {
    nom: 'Logo SérénIA Tech — Codex',
    duree_totale: 10000,
    etapes: [
      { id: 'logo_serenia_codex', duree: 8000, sousTitre: '' },
      { id: 'ecran_noir', duree: 2000, sousTitre: '' },
    ],
  },
});

const MONTAGES = window.MONTAGES;

function creerLecteurMontage(idMontage) {
  const def = MONTAGES[idMontage];
  let indexEtape = -1;
  let instanceCourante = null;
  let accumulateurEtape = 0;
  let accumulateurStep = 0;
  let termine = false;

  function passerEtapeSuivante() {
    indexEtape += 1;
    accumulateurEtape = 0;
    accumulateurStep = 0;
    if (indexEtape >= def.etapes.length) {
      termine = true;
      return;
    }
    const etape = def.etapes[indexEtape];
    instanceCourante = obtenirAnimation(etape.id).creer();
    if (instanceCourante.reset) instanceCourante.reset();
  }

  passerEtapeSuivante();

  return {
    nom: def.nom,
    estTermine: () => termine,
    sousTitre: () => (termine ? '' : def.etapes[indexEtape].sousTitre),
    avancer(dt) {
      if (termine) return null;
      const etape = def.etapes[indexEtape];
      accumulateurEtape += dt;
      accumulateurStep += dt;
      let dernierRendu = null;
      while (accumulateurStep >= instanceCourante.speed) {
        dernierRendu = instanceCourante.step();
        accumulateurStep -= instanceCourante.speed;
      }
      if (accumulateurEtape >= etape.duree) {
        passerEtapeSuivante();
      }
      return dernierRendu;
    },
  };
}
