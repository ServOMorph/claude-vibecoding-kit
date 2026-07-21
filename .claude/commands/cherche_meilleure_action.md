---
description: Analyse la situation du projet et recommande la meilleure action quand on hésite
argument-hint: [décision ou dilemme, optionnel]
model: opus
---

# /cherche_meilleure_action [décision ou dilemme]

## Objectif

Aider à trancher quand on ne sait pas quoi faire ensuite. La commande analyse le
contexte réel du projet (actions ouvertes, priorités, échéances, bloqueurs,
objectif), évalue les options selon des critères explicites, recommande **une**
action et se termine en demandant confirmation à l'utilisateur — jamais en
tranchant seule.

Ce n'est pas un générateur d'options : c'est un outil de décision. Si aucune
option n'a de valeur réelle, ou si le vrai problème est ailleurs, le dire.

## Procédure

1. Capter la décision à prendre ($ARGUMENTS) :
   - Si un dilemme est fourni en argument : le prendre comme question centrale.
   - Si absent : déduire la décision en suspens de la session en cours (dernière
     étape proposée, choix laissé ouvert). Si rien d'exploitable : demander
     "Sur quoi hésitez-vous exactement ?" et s'arrêter dans l'attente.

2. Déterminer la zone concernée :
   - Zone active de la session si elle existe, sinon working directory courant.
   - Résoudre le dossier réel (via `.claude/zones.md` si un alias est en jeu).

3. Charger la matière de décision, dans cet ordre :
   1. `<dossier>/_contexte/signals.md` — actions ouvertes (priorités P1/P2),
      échéances, blocages, contexte chaud.
   2. `<dossier>/_contexte/contexte.md` — objectif immuable, état actuel,
      décisions structurantes.
   3. `<dossier>/roadmap*.md` si présent — phase en cours, prochaine étape.
   - Pour chaque action ouverte pertinente comportant un champ `réf:`, lire les
     fichiers référencés avant d'évaluer (ne pas raisonner de mémoire sur une
     action dont la référence est disponible).

4. Établir la liste des options candidates, sans en inventer :
   - les actions ouvertes de `signals.md` ;
   - les branches du dilemme fourni à l'étape 1 ;
   - les options explicitement évoquées dans la session en cours.
   Fusionner les doublons. Ne pas gonfler la liste pour faire volume.

5. Évaluer chaque option selon ces critères, brièvement (pas un pavé par option) :
   - **Impact / valeur** : ce que ça débloque ou fait avancer réellement.
   - **Effort** : coût estimé (trivial / faible / moyen / lourd).
   - **Risque** : ce qui peut mal tourner, dette introduite, réversibilité.
   - **Dépendances / bloqueurs** : ce qui doit être fait avant, ou ce que ça bloque.
   - **Urgence** : échéance datée qui contraint le calendrier.
   - **Alignement** : cohérence avec l'objectif du projet (contexte.md).

6. Garde-fous d'honnêteté (prioritaires, cf. CLAUDE.md) — appliquer avant de conclure :
   - Si la "décision" revient à polir la méta (analyser l'analyse, auditer l'audit)
     au lieu d'avancer : le signaler et recommander de passer à l'action concrète.
   - Si aucune option n'a de valeur réelle, ou si le vrai levier est une option
     non listée : le dire franchement plutôt que de départager des options faibles.
   - Ne pas produire de recommandation rassurante mais creuse (prompt theater).
     La justification doit tenir en quelques lignes et reposer sur les critères
     de l'étape 5, pas sur une impression.

7. Produire la recommandation :
   - **Action recommandée** : une seule, nommée précisément.
   - **Pourquoi** : le critère décisif qui la place devant les autres (2-4 lignes).
   - **Alternatives classées** : les autres options, ordonnées, avec en une ligne
     le critère qui les fait passer derrière (et dans quel cas elles reprendraient
     la tête).

8. Étape finale obligatoire : poser la décision à l'utilisateur via une question
   de confirmation (recommandation en premier choix, marquée comme recommandée,
   suivie des alternatives). Ne pas exécuter l'action choisie dans la foulée sans
   validation — cette commande décide *quoi* faire, elle ne fait pas.

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- Convention : toute règle liée à une étape précise de la Procédure ci-dessus doit la
     référencer explicitement par son numéro, plutôt que compter sur la position physique
     de cette zone (toujours en fin de fichier). -->
<!-- SPECIFICITES PROJET : FIN -->
