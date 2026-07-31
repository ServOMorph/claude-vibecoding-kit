# Note de conception — pause de réflexion multi-agents dans `/init_projet`

Créée le : 2026-07-31. Document d'analyse/proposition, pas d'implémentation. Fait suite à
l'action P2 de `signals.md` (kit), déclenchée par un pattern observé lors de l'init
d'Open_Code_Apprentissage.

## 1. Constat à l'origine de la note

Lors de l'init d'`Open_Code_Apprentissage` (2026-07-31), `/init_projet` a créé la zone racine
`orchestrateur`, puis une discussion séparée avec l'utilisateur a permis de définir et valider
3 agents (`notes`, `narrateur`, `data`) — *avant* tout appel à `/create_agent`. Ce break n'est
prévu par aucune étape du kit : il a eu lieu parce que l'utilisateur l'a demandé explicitement
dans un fichier de cadrage propre au projet cible (`_DOCS/but du projet.txt`, points 8-10),
pas parce que `/init_projet` le proposait.

Réf. source : `D:\ServOMorph\Open_Code_Apprentissage\_DOCS\but du projet.txt` (points 8-10),
`D:\ServOMorph\Open_Code_Apprentissage\_contexte\signals.md`.

## 2. Problème identifié

`/init_projet` crée une zone racine et s'arrête (étape 8 : confirmation finale). Rien n'invite
l'utilisateur à se demander, à ce moment précis, si le projet a besoin de zones-agents
(`/create_agent`) et lesquelles. Sans ce prompt, deux issues possibles observées dans les
projets existants (cf. `AGENTS_REGISTRY.md`) :
- des agents créés au fil de l'eau, un par un, sans vue d'ensemble du découpage du projet ;
- un rôle d'agent mal cadré au départ, capté comme une tâche ponctuelle plutôt qu'un rôle
  durable, corrigé après coup (cas déjà documenté dans `ameliorations_create_agent.md`,
  rétrospective du 2026-07-21).

## 3. Proposition (arbitrages utilisateur du 2026-07-31)

- **Intégration** : nouvelle étape dans `/init_projet`, pas une modification de
  `/create_agent` ni une simple recommandation documentaire.
- **Déclenchement** : systématique — proposée à la fin de chaque `/init_projet`, y compris
  pour un projet mono-agent (réponse rapide possible).
- **Portée de cette session** : document seul. Aucune décision d'implémentation prise ici.

## 4. Points ouverts à trancher avant implémentation

Ces points n'ont pas été arbitrés le 2026-07-31 (hors périmètre de la question posée) :

1. **Position exacte dans `/init_projet`** : nouvelle étape entre l'étape 7 (liste des
   fichiers écrits) et l'étape 8 (confirmation finale), ou avant l'étape 3 (copie des
   fichiers) si la réponse doit influencer `{{STACK}}`/`{{OBJECTIF}}` des agents créés dans
   la foulée ?
2. **Contenu de la question posée** : ouverte ("des agents à prévoir pour ce projet ?") ou
   guidée par une liste de rôles-types déjà observés dans `AGENTS_REGISTRY.md`
   (communication, documentation, data, design...) ?
3. **Suite immédiate ou différée** : si l'utilisateur liste des agents pendant cette étape,
   `/init_projet` enchaîne-t-il directement sur `/create_agent` pour chacun (comme demandé
   explicitement par l'utilisateur pour Open_Code_Apprentissage, où la création a été faite
   dans une session ultérieure), ou se contente-t-il de consigner la liste validée dans
   `contexte.md` (section "Décisions structurantes") pour un `/create_agent` différé ?
4. **Persistance de la discussion** : si l'échange sur le nombre/rôle d'agents est riche
   (plusieurs allers-retours), faut-il en garder une trace au-delà de la ligne dans
   `contexte.md` — par exemple un export dans un fichier dédié, à l'image de cette note pour
   `/create_agent` ?
5. **Articulation avec la question Q5 existante de `/init_projet`** ("Première zone de ce
   projet, ou zone supplémentaire ?") : la nouvelle étape doit rester distincte de ce
   mécanisme, qui gère l'ajout d'une zone racine supplémentaire, pas la création d'agents.

## 5. Non traité par cette note

- Toute modification de `templates/.claude/commands/init_projet.md` ou de
  `.claude/commands/init_projet.md` (kit).
- Tout changement de version/bump du kit.
