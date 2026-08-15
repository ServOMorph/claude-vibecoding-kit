enregistrer({
  id: 'ecran_noir',
  nom: 'Écran noir (scintillement discret)',
  categorie: 'histoire',
  tags: ['outro', 'noir', 'silence', 'fin'],
  duree_recommandee: 2000,
  creer() {
    return {
      speed: 150,
      step() {
        return grille(() => (Math.random() < 0.0015 ? '.' : ' '));
      },
    };
  },
});
