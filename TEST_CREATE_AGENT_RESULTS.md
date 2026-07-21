# Journal de tests — `/create_agent`

Période de test ouverte le 2026-07-21. Objectif : exécuter `/create_agent`
réellement sur plusieurs projets/rôles, documenter au fil de l'eau ce qui se
passe (attendu vs observé), pour analyser ensuite les frictions et proposer
des améliorations. Clôturé quand la période de test est jugée suffisante
(décision utilisateur).

Un test = une entrée. Renseigner au fur et à mesure de l'exécution de la
commande, pas après coup de mémoire.

## Notes transverses (valables pour toute la période)

- Travailler la charte (`agent_role.md` / `agent_role_TEMPLATE.md`) comme un
  objet à tester spécifiquement, indépendamment de la commande : tester son
  efficacité sur trois axes — économie de tokens, alignement (l'agent reste
  dans son rôle/périmètre), rapidité/efficacité d'exécution. Reporté à une
  session dédiée, pas traité dans les tests `/create_agent` en cours.
- Idée soulevée : donner aux agents un accès à `/create_memory` ou imaginer un
  système d'apprentissage automatique des agents au fil de leur usage, en
  gérant le bruit généré pendant cette phase d'apprentissage (tests dédiés à
  prévoir pour analyser puis améliorer ce système). Tension identifiée avec
  la règle actuelle du kit : `.claude/memory.md` n'est jamais écrit
  directement, uniquement via `/create_memory` déclenché par l'utilisateur —
  un apprentissage automatique irait à l'encontre de ce garde-fou. Reporté à
  une session de conception dédiée, non traité dans les tests en cours.

---

## Test 1 — agent WEB (La Rev)

- **Date** : 2026-07-21
- **Projet cible** : `D:\ServOMorph\La Rev`
- **Dossier agent** : `WEB`
- **Rôle annoncé (avant lancement)** : créateur de page web
- **Commande lancée** : `/create_agent "D:\ServOMorph\La Rev" WEB créateur de page web`

### Déroulé pas à pas
| Étape procédure | Attendu | Observé | Friction ? |
|---|---|---|---|
| 1 — Arguments | Parser chemin + dossier + rôle | OK, rôle "créateur de page web" jugé durable sans relance | Oui — voir ci-dessous (périmètre d'écriture) |
| 2 — Résolution projet cible | Vérifier `<cible>/.claude/zones.md` | OK, `larev` présent | Non |
| 3 — Alias par défaut | `web` | OK | Non |
| 4 — Unicité alias | Vérifier absence dans zones.md | OK, `web` libre | Non |
| 5 — Arborescence créée | 3 fichiers écrits | Interrompue 2x par l'utilisateur pour amender la charte avant écriture définitive ; `contexte.md` enrichi par analyse réelle du projet cible (au lieu du stub générique du template) | Oui — voir ci-dessous |
| 6 — Ligne zones.md | Ajout `web \| <chemin>` | OK | Non |
| 7 — Rappel périmètre déclaratif | Rappel affiché | OK | Non |
| 8 — Liste fichiers | Liste avec liens cliquables | OK | Non |
| 9 — Confirmation | Message standard | OK | Non |
| 10 — Rappel Opus + journal ameliorations | Recommandation Opus + entrée dans `ameliorations_create_agent.md` | Recommandation faite dans le chat ; entrée dans `ameliorations_create_agent.md` **pas encore écrite** à ce stade | Oui — étape 10 non exécutée dans les faits |

### Frictions observées
- Étape 1, question périmètre d'écriture : la procédure attend une réponse binaire (non / liste de chemins), l'utilisateur a proposé un mécanisme plus riche (garde-fou par validation écrite dans un fichier lecture-seule pour le LLM avant toute écriture hors dossier). Non supporté par le template actuel — traité comme "non" pour ce test, noté comme piste d'amélioration future du template (pas implémenté).
- Étape 5, `agent_role_TEMPLATE.md` ne mentionnait pas explicitement le droit d'écrire dans son propre `_contexte/` (signals.md, contexte.md) alors que ce cycle est nécessaire pour `/start`/`/close`. Corrigé dans le template en cours de test (ligne ajoutée : "Peut mettre à jour son propre `_contexte/`...").
- Étape 5, `contexte.md` : le template produit un stub générique ("Hérite de la stack du projet parent."), peu utile en pratique. Une analyse manuelle du projet cible (ici `_docs/frontiere_donnees.md`, `plan_action_rev.md`, `charte_graphique_billets.md`) a permis d'écrire un contexte réellement exploitable pour l'agent — mais la procédure `/create_agent` ne prévoit pas cette étape d'analyse, elle a été faite hors procédure sur demande explicite.
- **Friction majeure, découverte après la création** : l'agent créé ne bénéficiait d'aucune charte visible au premier `/start web`, car `La Rev\.claude\commands\start.md` était une version antérieure au kit (v2.13, sans l'étape 2b de chargement de `agent_role.md`). `/create_agent` ne vérifie jamais que le projet cible dispose d'un `start.md` à jour supportant le chargement de charte — la fonctionnalité peut donc être silencieusement inopérante. Corrigé en lançant `/update` sur La Rev (v2.13 → v2.22) ; après update, `/start web` affiche bien la charte avant `signals.md`.
- Discussion ouverte sur le rôle de la charte comme "prompt de spécialisation" de l'agent — confirmé que c'est bien la charte entière (pas seulement le champ Rôle) qui joue ce rôle. Reporté à un futur travail dédié sur la charte (voir Notes transverses).

### Ce qui a bien fonctionné
- Résolution du projet cible externe (La Rev) depuis le kit, alias, vérification d'unicité : tout conforme à la procédure modifiée.
- Une fois La Rev à jour, `/start web` charge et affiche `agent_role.md` avant `signals.md`, comme prévu par la décision 4 du cadrage (roadmap_agents.md).
- `/update` exécuté individuellement sur La Rev : les 7 contrôles post-update passent, `_contexte/` et `zones.md` non touchés, commit propre limité à `.claude/commands/` et `.claude/CLAUDE.md`.

### Verdict
- [ ] Commande utilisable telle quelle
- [x] Commande utilisable avec réserves (préciser)
- [ ] Commande à corriger avant réutilisation

Réserve : `/create_agent` doit être utilisée uniquement sur un projet déjà à jour (kit courant), sinon le bénéfice principal (charte chargée automatiquement) est silencieusement absent. Pas de garde-fou automatique pour l'instant — vérification manuelle nécessaire avant chaque test.

---

<!-- Ajouter une nouvelle section "## Test N — agent <nom> (<projet>)" pour chaque nouveau test. -->

## Test 2 — agent linkedin (SérénIATech_dev)

- **Date** : 2026-07-21
- **Projet cible** : `C:\Users\raph6\Documents\SerenIATech\SérénIATech_dev`
- **Dossier agent** : `Communication\Linkedin` (alias `linkedin`)
- **Rôle annoncé (avant lancement)** : spécialiste de la communication sur LinkedIn
- **Particularité** : contrairement au Test 1, la zone existait déjà (alias `linkedin` déjà
  enregistré dans `zones.md`, `_contexte/` réel et mature) — pas une création ex nihilo.

### Déroulé pas à pas
| Étape procédure | Attendu | Observé | Friction ? |
|---|---|---|---|
| 1 — Arguments | Chemin + dossier + rôle durable | OK, rôle jugé durable directement | Non |
| 2 — Résolution projet cible | Vérifier `zones.md` | OK | Non |
| 2b — Vérif `start.md` cible | Chargement charte présent ? | Absent (kit v2.13) : averti, utilisateur a choisi de lancer `/update` d'abord plutôt que de continuer avec risque | Oui — friction P6 redétectée, corrigée en amont (voir ci-dessous) |
| 3-4 — Alias + unicité | Refuser si alias déjà pris | Alias `linkedin` déjà présent : procédure standard aurait refusé. Décision manuelle : c'est le cas voulu (même zone), pas une collision — zones.md non modifié | Oui — procédure ne prévoit pas ce cas (voir P12) |
| 5 — Arborescence | 3 fichiers écrits | Seul `agent_role.md` créé ; `_contexte/signals.md`/`contexte.md` existants conservés (décision utilisateur), section de renvoi ajoutée en fin de `contexte.md` | Oui — décision manuelle hors procédure standard |
| 6 — Ligne zones.md | Ajout | Non applicable, ligne déjà présente | Non |
| 7 — Rappel périmètre déclaratif | Affiché | OK | Non |
| 8-9 — Liste + confirmation | Standard | OK | Non |
| 10 — Rappel Opus + journal | Entrée `ameliorations_create_agent.md` | Faite dans la foulée (cette session) | Non |

### Frictions observées
- **Friction P6 reconfirmée** : `start.md` de SérénIATech_dev (v2.13) ne chargeait pas la charte.
  Contrairement à La Rev (où la friction avait été découverte après coup), ici la vérification de
  l'étape 2b l'a détectée *avant* la création — comportement correctif qui marche comme prévu.
  Résolu par un `/update` individuel du projet (v2.13 → v2.24, tous les contrôles post-update
  passent) avant de relancer la création de l'agent.
- **Friction nouvelle (P11)** : `{{ALIAS_RACINE}}` = « première ligne de `zones.md` » n'a de sens
  que si cette ligne est effectivement la zone racine. Ici la première ligne est `administratif`
  (une zone parmi d'autres) — le champ « Zone parente » de la charte générée est trompeur.
- **Friction nouvelle (P12)** : la procédure ne prévoit aucun chemin pour convertir une zone déjà
  enregistrée en agent (elle suppose toujours une création neuve, refuse même l'alias existant).
  Traité ici par déviation manuelle validée par l'utilisateur (charte seule, `_contexte/` et
  `zones.md` intouchés) plutôt que par la procédure telle qu'écrite.

### Ce qui a bien fonctionné
- La détection de l'étape 2b a fonctionné comme prévu : avertissement clair, confirmation demandée
  avant de continuer, aucune création silencieuse d'un agent inopérant.
- Une fois `/update` fait, `agent_role.md` peut être ajouté sans toucher au reste de la zone —
  la séparation charte / `_contexte/` du modèle d'agent se prête bien à cette conversion a
  posteriori, même si la procédure écrite ne la documente pas encore.

### Verdict
- [ ] Commande utilisable telle quelle
- [x] Commande utilisable avec réserves (préciser)
- [ ] Commande à corriger avant réutilisation

Réserve : cas de conversion d'une zone existante non couvert par la procédure (P12) ; champ
`{{ALIAS_RACINE}}` peu fiable sur un projet sans alias racine explicite (P11). Aucun des deux
n'a bloqué le test, traités par décision manuelle documentée.

---

## Synthèse (à remplir en fin de période de test)

- Nombre de tests réalisés :
- Frictions récurrentes :
- Propositions d'amélioration :
- Décision de clôture :
