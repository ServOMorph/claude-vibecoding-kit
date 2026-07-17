# La Rev

## Identité
- Chemin : `D:\ServOMorph\La Rev`
- Zone : larev
- Version kit : v2.12

## Historique git
- Nombre de commits : 6

- 2026-07-17 e5a0a1a close(larev): session 2026-07-17 — règles et prototypes fictifs
- 2026-07-17 7a10614 update: protocole vibecoding — zone larev — kit v2.13
- 2026-07-17 45eef98 close(larev): session 2026-07-17 — phase 1 terminée
- 2026-07-17 d91f810 close(larev): session 2026-07-17 — roadmap créée
- 2026-07-17 5ac4242 close(larev): session 2026-07-17 — plan d'action proposé
- 2026-07-17 54fbec8 init: protocole vibecoding — zone larev

## État du working tree (non commité)
```
M AGENTS.md
?? ollama_call.py
```

## Contexte stable (_contexte/contexte.md)

# Contexte — larev

## Objectif (immuable sauf décision explicite)
Créer une monnaie locale imprimable (le Rev, 1 minute de travail = 1 Rev) pour comptabiliser des échanges de services entre pairs (troc), avec design de billets numérotés et marqués individuellement pour limiter la contrefaçon.

## Stack / contraintes techniques (stable, rarement modifié)
- Landing page publique avec statistiques agrégées et anonymes.
- Application HTML locale de gestion ; registre nominatif dans `donnees_privees/`, interdit à toute IA.

## État actuel (réécrit intégralement à chaque /close)
- Les phases 1, 2 et 3 de `roadmap_rev.md` sont clôturées ; l'émission réelle, le registre réel et la publication restent bloqués par le cadrage de phase 3.
- La phase 4 est en cours : le prototype SVG fictif, sa spécification et les contrôles automatiques sont disponibles.
- Les mockups retiennent un blaireau explorateur comme personnage à rechercher ; ils restent des pistes graphiques non imprimées.
- L'essai papier à 100 % demeure nécessaire avant toute validation matérielle du prototype.
- Le registre nominatif et les actifs sensibles restent exclus de Git et interdits à l'IA.

## Décisions structurantes (append only — 10 entrées max, archiver au-delà)
- 2026-07-17 : Initialisation du protocole vibecoding.
- 2026-07-17 : La Rev est un crédit de temps expérimental (1 minute = 1 Rev) pour des échanges de proximité en France.
- 2026-07-17 : Le registre nominatif sera conservé dans `donnees_privees/`, exclu de toute lecture et écriture par une IA.
- 2026-07-17 : La roadmap de suivi `roadmap_rev.md` est créée ; sa phase 1 porte sur la frontière des données et actifs sensibles.
- 2026-07-17 : Le plan d'action est validé.
- 2026-07-17 : La phase 1 est validée : les contrats de registre privé et d'export public sont séparés et leurs exclusions Git vérifiées.
- 2026-07-17 : Le pilote fictif est plafonné à 640 Rev et les règles d'émission, incidents, gouvernance et publication sont éprouvées sur scénarios fictifs.
- 2026-07-17 : L'émission, la circulation réelle et la publication publique sont bloquées jusqu'à une validation juridique, fiscale et RGPD compétente.
- 2026-07-17 : Le blaireau explorateur est retenu comme personnage à rechercher dans les mockups de billets fictifs.

## Signals (_contexte/signals.md)

# Signals — larev (MAJ 2026-07-17)

## Actions ouvertes

- [P1|ouvert] Lever ou confirmer le blocage avant toute émission, circulation réelle ou publication publique.
  fait quand: une décision écrite qualifie le dispositif, fixe les obligations fiscales et RGPD, et autorise explicitement ou interdit définitivement le pilote réel.
  réf: `_docs/cadre_francais_phase3.md`, `_docs/regles_premiere_emission.md`
- [P1|ouvert] Valider physiquement le prototype de billet fictif.
  fait quand: le SVG est imprimé à 100 %, puis les dimensions, lisibilité, découpe, marque manuscrite et comparaison à une copie simple sont consignées.
  réf: `_docs/specification_prototype_billet_phase4.md`, `billets/prototypes/rev_60_pilote_fictif.svg`

## Questions ouvertes

## Échéances

## Blocages

- Émission, circulation réelle, registre nominatif réel et diffusion publique sont bloqués jusqu'à satisfaction des conditions de phase 3.

## Contexte chaud

- `donnees_privees/` reste strictement interdit à toute lecture ou écriture par une IA.
- Les règles de phase 2 sont cohérentes sur six scénarios fictifs, dont le seuil de publication : 10 participants actifs durant 30 jours continus, publication au plus mensuelle.
- Le prototype SVG et les mockups sont fictifs, non convertibles et sans cours légal ; ils ne constituent pas une autorisation d'émission.
- La direction graphique retenue utilise le blaireau explorateur, réduit dans les scènes pour devenir un personnage à rechercher ; l'essai papier reste à réaliser.

## Dernière session

# Session du 2026-07-17

## Décisions prises
- Le pilote fictif est plafonné à 640 Rev ; aucune émission réelle n'est autorisée à ce stade.
- Le seuil de publication est fixé à 10 participants actifs durant 30 jours continus, sans garantie d'anonymisation.
- Le blaireau explorateur est retenu comme personnage à rechercher sur les mockups.

## Livrables produits ou modifiés
- `_docs/regles_premiere_emission.md` et scénarios : règles et épreuves fictives de phase 2.
- `_docs/cadre_francais_phase3.md` : blocage documenté de l'émission réelle et conditions de levée.
- `billets/prototypes/` : SVG fictif, spécification, charte graphique et mockups de travail.

## Hypothèses validées / invalidées
- VALIDE : les vérifications des phases 1, 2 et du prototype SVG passent sans accès aux données privées.
- INVALIDE : un simple crédit de temps informel peut être émis ou publié sans analyse juridique, fiscale et RGPD complémentaire.
- EN ATTENTE : essai matériel du prototype et décision compétente sur le pilote réel.

## Prochaine étape exacte
Imprimer `billets/prototypes/rev_60_pilote_fictif.svg` à 100 %, puis consigner les résultats selon la spécification de phase 4.

## Question bloquante pour la session suivante
Aucune

## Roadmaps (titres et statuts de phases)

### roadmap_rev.md

# Roadmap de suivi — La Rev
## Phase 1 — Frontière des données et des actifs sensibles [FAIT]
## Phase 2 — Règles, émission et gouvernance [FAIT]
## Phase 3 — Vérification du cadre français [FAIT]
## Phase 4 — Conception et validation du billet [EN COURS]
## Phase 5 — Landing page publique [TODO]
## Phase 6 — Application locale de gestion [TODO]
## Phase 7 — Test contrôlé à deux personnes [TODO]

## Sessions Claude Code (transcripts)

- Aucun transcript trouvé pour ce chemin.
