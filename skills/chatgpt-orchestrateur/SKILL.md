---
name: chatgpt-orchestrateur
description: Pilote une boucle où une session IA gratuite (ChatGPT web pour l'instant, d'autres IA à terme) sert d'orchestrateur donnant des instructions à cet agent Claude Code, qui les exécute et rend compte. Gère la persistance de l'état de mission en fichiers Markdown par agent, journalise tous les échanges pour analyse ultérieure, et régénère un prompt de reprise complet quand la session gratuite expire et doit être relancée. Déclencher quand l'utilisateur relaie un message de ChatGPT (ou d'une autre IA orchestratrice), demande un compte-rendu à envoyer à l'orchestrateur, ou signale que la session est terminée.
---

# chatgpt-orchestrateur

## Rôle et contrainte centrale

Dans ce mécanisme, **une IA en session gratuite web est l'orchestrateur** (ChatGPT pour l'instant, d'autres IA prévues à terme) : elle donne des instructions, cet agent (Claude Code) les exécute et rend compte. L'utilisateur relaie manuellement les messages dans les deux sens.

Contrainte non négociable : la session gratuite est **limitée en nombre de messages** et peut se terminer à tout moment, sans préavis fiable. Cet agent ne doit jamais dépendre de la mémoire d'une session orchestratrice — tout le contexte nécessaire à la reprise vit dans des fichiers Markdown persistants.

Deuxième objectif, permanent : **journaliser tous les échanges**, avec chaque agent orchestrateur utilisé, pour analyse ultérieure et amélioration de la communication propre à chaque agent (formulations, longueur, format attendu). Dans un premier temps, seul ChatGPT est journalisé — le mécanisme est générique par construction (paramètre `-Agent`) pour accueillir d'autres IA sans reconception.

## Économie de tokens — utiliser les scripts, ne jamais réécrire les fichiers à la main

Les fichiers d'état (`etat.md`, `decisions.md`, `questions_ouvertes.md`, `log.jsonl`) sont gérés exclusivement par les scripts PowerShell de `skills/chatgpt-orchestrateur/scripts/`, jamais par écriture directe (`Write`/`Edit`). Un appel de script avec des paramètres courts coûte nettement moins de tokens que recomposer un fichier Markdown complet à chaque mise à jour.

- `init_agent.ps1 -DossierEtat <chemin> -Agent <nom> -Mission <texte> -Objectif <texte>` — initialise l'arborescence d'un agent.
- `maj_etat.ps1 -DossierEtat <chemin> -Agent <nom> [-Etape ...] [-DernierEchange ...] [-ProchaineAction ...] [-NumeroSession N]` — met à jour uniquement les champs fournis, conserve les autres.
- `log_echange.ps1 -DossierEtat <chemin> -Agent <nom> -Type instruction|rapport|reprise -Contenu <texte> -Resume <texte court>` — archive l'échange, ajoute une ligne au journal, tente `Set-Clipboard`. Utiliser `-FichierContenu <chemin>` au lieu de `-Contenu` si le contenu a déjà été écrit dans un fichier (évite de le repasser deux fois).
- `generer_reprise.ps1 -DossierEtat <chemin> -Agent <nom>` — assemble seul le prompt de reprise à partir de `etat.md`/`decisions.md`/`questions_ouvertes.md`/dernier rapport, l'archive, tente le clipboard, incrémente le numéro de session. Aucune composition manuelle du prompt nécessaire.
- `coller_et_envoyer.ps1 [-NomProcessus chrome] [-Moitie gauche|droite|aucune] [-TitreContient <texte>] [-SansEnvoi]` — envoi automatique vers la fenêtre de l'orchestrateur : active la fenêtre du navigateur ciblé (par défaut la moitié gauche de l'écran), clique dans la zone de saisie, colle le presse-papier (`Ctrl+V`), appuie sur Entrée. `-SansEnvoi` colle sans valider (utile pour vérifier le ciblage). Si zéro ou plusieurs fenêtres correspondent, échoue proprement sans rien cliquer ni envoyer — jamais de devinette.

### Envoi automatique — convention

Après tout `log_echange.ps1`/`generer_reprise.ps1` qui produit un message **à destination de l'orchestrateur** (types `rapport` et `reprise`, jamais `instruction`), enchaîner avec `coller_et_envoyer.ps1` pour l'envoyer directement dans sa fenêtre, sans attendre que l'utilisateur colle à la main. C'est un confort qui s'ajoute au clipboard, jamais un remplacement : si `coller_et_envoyer.ps1` échoue (fenêtre introuvable ou ambiguë), le contenu reste dans le presse-papier et dans `echanges/` — l'utilisateur colle manuellement, aucun blocage.

## Argument requis

`<dossier_etat>` : chemin vers le dossier racine multi-agents (ex. `D:\ServOMorph\MonProjet\_orchestrateur_ia`). Générique et réutilisable sur n'importe quel projet — toujours fourni explicitement par l'utilisateur à la première utilisation, puis réutilisé.

`<nom_agent>` : identifiant court de l'IA orchestratrice (ex. `chatgpt`). Permet plusieurs orchestrateurs en parallèle sous le même `<dossier_etat>` sans collision. À défaut de précision de l'utilisateur, utiliser `chatgpt`.

## Structure de l'état persistant

Dans `<dossier_etat>/<nom_agent>/` :

- **`etat.md`** — écrasé à chaque mise à jour (jamais en append) :
  ```
  Mission : <titre bref>
  Objectif actuel : <1-2 lignes>
  Etape en cours : <libellé>
  Dernier echange : AAAA-MM-JJ HH:MM - <1 ligne>
  Prochaine action attendue : <1 ligne>
  Numero de session en cours : <entier, incrémenté à chaque redémarrage>
  Mis a jour : AAAA-MM-JJ HH:MM
  ```
- **`decisions.md`** — append-only, jamais purgé : `[AAAA-MM-JJ] <décision> — raison en 1 ligne`
- **`questions_ouvertes.md`** — une ligne par question en attente de réponse de l'orchestrateur, purgée dès qu'elle est tranchée : `[AAAA-MM-JJ] <question>`
- **`echanges/`** — archive brute horodatée, contenu intégral, jamais réinjectée en entier dans un prompt :
  - `AAAA-MM-JJ_HHhMM_instruction.md` (instruction reçue de l'orchestrateur)
  - `AAAA-MM-JJ_HHhMM_rapport.md` (compte-rendu envoyé à l'orchestrateur)
  - `AAAA-MM-JJ_HHhMM_reprise.md` (prompt de reprise généré à un redémarrage de session)
- **`log.jsonl`** — journal léger, une ligne JSON par échange, écrit par `log_echange.ps1` : `{"horodatage", "agent", "type", "resume", "fichier"}`. Ne contient jamais le contenu intégral (déjà dans `echanges/`) — sert de base d'analyse ultérieure (fréquence, longueur des échanges, types de blocages par agent) sans avoir à relire tous les fichiers `echanges/`.

## Actions

### 1. Initialisation d'une mission

Si `<dossier_etat>/<nom_agent>/` n'existe pas encore : appeler `init_agent.ps1`. Générer ensuite le prompt d'amorçage pour la première session (rôle d'orchestrateur, contrainte de session limitée, format attendu des instructions) et l'archiver via `log_echange.ps1 -Type reprise`.

Le prompt d'amorçage doit toujours exiger explicitement que l'orchestrateur réponde en **un seul bloc Markdown prêt à copier, sans aucun commentaire hors bloc** — sinon l'utilisateur doit nettoyer manuellement le message avant de le coller dans Claude Code, ce qui coûte du temps et des tokens à chaque échange. Cette exigence doit être répétée dans chaque prompt de reprise (`generer_reprise.ps1`), pas seulement à l'amorçage.

Enchaîner avec `coller_et_envoyer.ps1` pour l'envoyer directement dans la fenêtre de l'orchestrateur.

### 2. Réception d'une instruction de l'orchestrateur

Quand l'utilisateur colle un message reçu : l'archiver via `log_echange.ps1 -Type instruction -Resume <1 ligne>`, exécuter le travail demandé, puis `maj_etat.ps1` (dernier échange, prochaine action) et compléter `decisions.md`/`questions_ouvertes.md` si l'instruction en contient (append direct, ces deux fichiers ne passent pas par un script).

### 3. Compte-rendu vers l'orchestrateur

Après exécution, produire un message compact (pas un pavé de logs bruts) : ce qui a été fait, résultat, points nécessitant une décision. Archiver via `log_echange.ps1 -Type rapport -Resume <1 ligne>`, puis enchaîner avec `coller_et_envoyer.ps1` pour l'envoyer directement.

### 4. Session terminée — reprise

Déclenché explicitement par l'utilisateur ("session finie", "relance une session", ou équivalent). Appeler `generer_reprise.ps1` — il assemble le prompt, l'archive, tente le clipboard, incrémente le numéro de session et met à jour `etat.md`, sans composition manuelle. La nouvelle session s'ouvre dans une fenêtre/onglet que l'utilisateur doit avoir prêt (même position écran) avant d'enchaîner avec `coller_et_envoyer.ps1` ; à défaut de fenêtre détectée, le contenu reste disponible dans le presse-papier et dans `echanges/`.

### 5. Statut

Sur demande, afficher `etat.md` et `questions_ouvertes.md` de l'agent concerné sans rien modifier.

## Règles

- Ne jamais reconstruire un prompt de reprise à partir de la mémoire de la conversation Claude Code en cours : toujours via `generer_reprise.ps1`, à partir des fichiers `<dossier_etat>/<nom_agent>/*.md`.
- Ne jamais réinjecter `echanges/` en entier dans un prompt de reprise — `generer_reprise.ps1` ne prend que `etat.md`/`decisions.md`/`questions_ouvertes.md` et le dernier `_rapport.md`.
- `Set-Clipboard` est un confort, jamais une dépendance bloquante : le fichier écrit dans `echanges/` fait toujours foi.
- Aucune dépendance externe : PowerShell `Set-Clipboard` (déjà la convention du kit, cf. `.claude/commands/create_agent.md` étape 10), pas de bibliothèque tierce.
- Toute mise à jour de `etat.md` passe par `maj_etat.ps1`, jamais par `Write`/`Edit` direct — économie de tokens.
- `coller_et_envoyer.ps1` ne sert qu'à envoyer des messages **vers** l'orchestrateur (rapport, reprise) — jamais utilisé sur une instruction reçue de l'orchestrateur. En cas de doute sur la fenêtre ciblée (plusieurs correspondances, ambiguïté), le script échoue sans cliquer plutôt que de deviner.
- Ce mécanisme reste un outil de collaboration ponctuel, distinct de tout skill générique de conception de workflow multi-agents — il ne doit jamais devenir une dépendance obligatoire d'un tel skill.
