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
- `log_echange.ps1 -DossierEtat <chemin> -Agent <nom> -Type instruction|rapport|reprise -Contenu <texte> -Resume <texte court>` — archive l'échange, ajoute une ligne au journal, tente `Set-Clipboard`, met à jour `usage.json` (voir section dédiée ci-dessous). Utiliser `-FichierContenu <chemin>` au lieu de `-Contenu` si le contenu a déjà été écrit dans un fichier (évite de le repasser deux fois).
- `maj_usage.ps1 -DossierEtat <chemin> -Agent <nom> [-CaracteresAjoutes <int>] [-SeuilTokens <int>] [-Reinitialiser]` — appelé automatiquement par `log_echange.ps1`, rarement à appeler seul (voir section dédiée ci-dessous).
- `generer_reprise.ps1 -DossierEtat <chemin> -Agent <nom>` — assemble seul le prompt de reprise à partir de `etat.md`/`decisions.md`/`questions_ouvertes.md`/dernier rapport, l'archive, tente le clipboard, incrémente le numéro de session. Aucune composition manuelle du prompt nécessaire.
- `coller_et_envoyer.ps1 -TitreContient <texte> [-Moitie gauche|droite|aucune] [-DossierEtat <chemin> -Agent <nom>] [-PositionClicX ..] [-PositionClicY ..] [-SansEnvoi] [-SeulementValider]` — envoi automatique vers la fenêtre de l'orchestrateur : active la fenêtre ciblée par titre (par défaut restreinte à la moitié gauche de l'écran), clique dans la zone de saisie, colle le presse-papier (`Ctrl+V`), appuie sur Entrée. Avec `-DossierEtat`/`-Agent`, charge automatiquement `calibration.json` s'il existe pour la position de clic (voir calibration ci-dessous) — sans ce couple de paramètres, ou en l'absence de calibration, retombe sur la position par défaut (0.5, 0.93). `-PositionClicX`/`-PositionClicY` passés explicitement priment toujours sur la calibration. `-SansEnvoi` colle sans valider (utile pour vérifier le ciblage, voir calibration). `-SeulementValider` saute le clic et le collage, envoie uniquement Entrée — **obligatoire pour valider un envoi après un test `-SansEnvoi` réussi** : rappeler le script sans ce flag re-cliquerait et re-collerait le contenu une seconde fois (doublon silencieux, aucune erreur remontée). Si zéro ou plusieurs fenêtres correspondent, échoue proprement sans rien cliquer ni envoyer — jamais de devinette.
- `capturer_fenetre.ps1 -DossierEtat <chemin> -Agent <nom> -TitreContient <texte> [-Moitie gauche|droite|aucune]` — capture un screenshot PNG de la fenêtre ciblée (mêmes critères de ciblage que `coller_et_envoyer.ps1`), l'enregistre dans `<dossier_etat>/<agent>/calibration/` et affiche ses dimensions. Sert à déterminer visuellement (lecture de l'image) la position réelle du champ de saisie quand la mise en page a changé (nouvelle conversation, fenêtre redimensionnée), ou celle du bouton "copier" d'une réponse (voir récupération automatique ci-dessous) — **et à vérifier que c'est la bonne fenêtre/conversation avant toute action** (voir section bureaux virtuels ci-dessous).
- `maj_calibration.ps1 -DossierEtat <chemin> -Agent <nom> -PositionClicX <0-1> -PositionClicY <0-1>` — enregistre la position de clic déterminée (fractions de largeur/hauteur de fenêtre) dans `calibration.json`, réutilisée automatiquement par `coller_et_envoyer.ps1` tant qu'elle n'est pas remplacée.
- `defiler_fenetre.ps1 -TitreContient <texte> [-Moitie gauche|droite|aucune] [-AllerEnBas | -Crans 5]` — fait défiler la fenêtre ciblée. `-AllerEnBas` (mode par défaut à utiliser) : clic neutre dans la zone de contenu puis touche `Fin`, saute directement au bas de la page en un seul appel, quel que soit le point de départ — beaucoup plus rapide que la molette. Sans ce flag : molette simulée, `Crans` crans vers le bas (mode de repli si `-AllerEnBas` échoue pour une raison quelconque) ; ne détecte pas seul la fin de page, à alterner avec `capturer_fenetre.ps1` pour vérifier visuellement.
- `cliquer_fenetre.ps1 -TitreContient <texte> -PositionClicX <0-1> -PositionClicY <0-1> [-Moitie gauche|droite|aucune]` — clic simple à une position donnée de la fenêtre ciblée, sans collage ni validation. Utile pour un clic isolé (ex. vérifier un ciblage) hors du flux de récupération de réponse.
- `capturer_presse_papier.ps1 -DossierEtat <chemin> -Agent <nom>` — lit le contenu actuel du presse-papier et l'écrit dans `<dossier_etat>/<agent>/_dernier_presse_papier.md`. Utile seul si le presse-papier a déjà été rempli autrement.
- `copier_reponse.ps1 -TitreContient <texte> -PositionClicX <0-1> -PositionClicY <0-1> -DossierEtat <chemin> -Agent <nom> [-Moitie gauche|droite|aucune]` — **script à utiliser pour récupérer une réponse** : combine en un seul appel le clic sur le bouton "copier" et l'écriture du presse-papier dans `<dossier_etat>/<agent>/_dernier_presse_papier.md`. Place un marqueur unique dans le presse-papier avant de cliquer, pour distinguer un vrai échec de copie d'un presse-papier resté au contenu précédent (voir piège ci-dessous) ; échoue explicitement si le contenu après clic est vide ou toujours le marqueur. Position déterminée au cas par cas via `capturer_fenetre.ps1` (la position du bouton "copier" varie à chaque réponse selon sa longueur — pas de calibration réutilisable comme pour le champ de saisie).

**Piège constaté (2026-08-18) : un clic "copier" qui échoue silencieusement laisse le presse-papier inchangé, pas vide.** `log_echange.ps1` remplit le presse-papier au moment de l'envoi (`Set-Clipboard`) ; si le clic suivant sur le bouton "copier" rate sa cible, `Get-Clipboard` renvoie encore ce contenu précédent (le propre message envoyé par l'agent, pas la réponse de ChatGPT) — non vide, donc indétectable par un simple test de vacuité. `copier_reponse.ps1` neutralise ce piège via le marqueur unique décrit ci-dessus ; en cas d'usage manuel de `cliquer_fenetre.ps1` + `capturer_presse_papier.ps1` séparément, vider le presse-papier avant le clic (`Set-Clipboard -Value ''`) pour garder cette protection.

**Risque de vol de focus constaté (2026-08-18) : `SetForegroundWindow` peut échouer silencieusement et le clic part alors vers la fenêtre réellement active (pas celle ciblée par `-TitreContient`).** Windows restreint `SetForegroundWindow` quand l'appelant n'a pas le focus utilisateur — un clic programmé peut alors atterrir sur une tout autre fenêtre (constaté : un clic visant Chrome a atterri sur la fenêtre VS Code/Claude Code elle-même). Aucun correctif fiable identifié à ce stade ; en attendant, vérifier systématiquement par capture (`capturer_fenetre.ps1`) que le contenu attendu est bien arrivé dans la bonne fenêtre après un clic sensible, plutôt que de faire confiance au code de retour du script.

**Ciblage de fenêtre (2026-08-18) : `-TitreContient` est obligatoire sur tous ces scripts, `-NomProcessus`/`Get-Process` a été abandonné.** `Get-Process -Name chrome | Where MainWindowTitle` s'est montré peu fiable dès que plusieurs fenêtres Chrome existent (retourne parfois une fenêtre différente de celle demandée, sans lien avec le bureau virtuel actif — constaté en session, cause non élucidée). Tous les scripts utilisent désormais `EnumWindows` (fiable, trouve aussi les fenêtres cloaked sur un autre bureau — d'où la vérification par capture, ci-dessous, qui reste nécessaire). Choisir un `-TitreContient` suffisamment spécifique : un mot seul comme `"ROBERTO"` peut matcher un salon Discord (`#roberto`) ou un autre projet en plus de la conversation ChatGPT visée.
- `afficher_overlay_debut.ps1 -Agent <nom> -Raison <texte> [-DureeSecondes 2]` — overlay plein écran, style bleu clair doux/halo lumineux animé (voir charte graphique ci-dessous), ferme automatiquement après `DureeSecondes` (ou plus tôt sur clic). Affiche le nom de l'agent et la raison de la prise de contrôle.
- `afficher_overlay_fin.ps1 -Agent <nom> [-Message "J'ai fini"] [-DureeSecondes 2]` — même style, ferme automatiquement après `DureeSecondes` (ou plus tôt sur clic). Pas de bouton (retiré le 2026-08-18 sur demande utilisateur — l'auto-fermeture suffit).
- `afficher_indicateur_clic.ps1 -X <int> -Y <int> [-DureeMs 500]` — petit anneau néon pulsant, affiché en coordonnées écran absolues, cliquable-à-travers (`WS_EX_TRANSPARENT`), auto-fermeture après `DureeMs`. Appelé automatiquement par `cliquer_fenetre.ps1`, `copier_reponse.ps1` et `coller_et_envoyer.ps1` juste avant chaque clic réel — jamais à appeler seul dans le flux normal.
- `demarrer_bordure_controle.ps1 -DossierEtat <chemin> -Agent <nom>` — lance en arrière-plan (process détaché, PID écrit dans `<dossier_etat>/<agent>/_bordure.pid`) une bordure néon animée autour de l'écran entier, cliquable-à-travers, qui reste affichée jusqu'à `arreter_bordure_controle.ps1`. Idempotent (ne relance pas si déjà active).
- `arreter_bordure_controle.ps1 -DossierEtat <chemin> -Agent <nom>` — arrête la bordure démarrée par le script précédent (`Stop-Process` sur le PID enregistré) et supprime le fichier PID.
- `attendre_bureau.ps1 -Agent <nom> [-Message <texte>]` — overlay plein écran, même style néon, **avec bouton OK** (seul overlay du skill à en avoir un — usage différent des overlays début/fin, voir déclencheur ci-dessous), bloquant jusqu'au clic (ou Entrée).

## Déclencheur "je change de bureau"

Décision utilisateur (2026-08-18) : quand l'utilisateur annonce explicitement qu'il va changer de bureau virtuel (formulations du type "je change de bureau", "je bascule", ou équivalent clair), ne pas lancer d'action PC immédiatement après, même si une action est en attente.

1. Attendre que l'utilisateur confirme avoir terminé son changement (ou lancer directement `attendre_bureau.ps1 -Agent <nom_agent>` si une action PC était déjà prévue juste après) — le script bloque jusqu'au clic sur OK, signal explicite que l'utilisateur a fini et que l'agent peut prendre la main.
2. Une fois OK cliqué : vérifier qu'on est au bon endroit (capture + lecture, cf. section bureaux virtuels/vérification ci-dessus) avant de lancer la séquence normale (overlay début, bordure, actions).
3. Si l'utilisateur précise "bascule au bon endroit" ou équivalent (il délègue explicitement la bascule à l'agent plutôt que de la faire lui-même) : utiliser `activer_bureau_cible.ps1` en repli automatique après le clic OK, avec un `-TitreContientA` non ambigu.

## Bureaux virtuels Windows et vérification avant action (2026-08-18 — procédure simplifiée)

Le poste de l'utilisateur utilise plusieurs bureaux virtuels Windows, et les fenêtres se ressemblent d'une conversation à l'autre (on continue en général la même conversation ChatGPT plusieurs échanges de suite, pas une nouvelle à chaque fois). Deux échecs silencieux distincts constatés en session :

- capturer/cliquer sur le mauvais bureau virtuel (contenu totalement différent affiché, aucune erreur) ;
- le filtrage par titre (`-TitreContient`) est ambigu : `"ROBERTO"` a par exemple matché un salon Discord (`#roberto`) au lieu de l'onglet ChatGPT — la détection automatique par titre n'est pas fiable seule.

**La détection/bascule automatique de bureau (`activer_bureau_cible.ps1`, ci-dessous) est donc reléguée en repli optionnel.** Procédure par défaut, avant toute séquence d'actions PC :

1. Demander à l'utilisateur de confirmer que les fenêtres nécessaires (ChatGPT, et la fenêtre de cet agent si pertinent) sont visibles sur le bureau actif — attendre sa réponse, ne rien lancer avant.
2. Une fois confirmé : `capturer_fenetre.ps1 -DossierEtat <chemin> -Agent <nom> -TitreContient <texte>` puis **lire l'image** — vérifier que c'est non seulement la bonne fenêtre, mais surtout **la bonne conversation** (dernier message visible cohérent avec l'échange précédent, pas une conversation ChatGPT différente ou périmée).
3. Si la capture ne correspond pas à ce qui est attendu : le signaler à l'utilisateur plutôt que de continuer à l'aveugle.
4. Seulement après cette vérification : lancer la séquence (overlay début, bordure, actions).

`activer_bureau_cible.ps1 -TitreContientA <texte> [-TitreContientB <texte>] [-MaxBureaux 8]` reste disponible en repli si l'utilisateur préfère une bascule automatique (détection par l'attribut DWM `CLOAKED`, teste chaque bureau via `Ctrl+Win+Flèche`) — mais choisir un `-TitreContientA` sans ambiguïté (éviter les mots courts comme `ROBERTO` seul, présents ailleurs sur le poste) et vérifier quand même par capture après bascule, pour la même raison qu'au point 2.

**Bug corrigé (2026-08-18) : ne jamais `ShowWindow(SW_RESTORE)` une fenêtre sans vérifier `IsIconic` au préalable.** Appliqué sans condition, `SW_RESTORE` désancre/démaximise une fenêtre déjà maximisée ou snappée (elle repasse en fenêtre flottante à sa taille précédente) — constaté sur la fenêtre VSCode de l'utilisateur, déplacée sans qu'aucune minimisation n'ait eu lieu. `activer_bureau_cible.ps1` ne restaure désormais que si `IsIconic(hwnd)` est vrai (fenêtre effectivement réduite dans la barre des tâches).

## Overlay de prise de contrôle du PC

Décision utilisateur (2026-08-18) : toute séquence d'actions manipulant la souris/clavier de l'utilisateur (`coller_et_envoyer.ps1`, `defiler_fenetre.ps1`, `cliquer_fenetre.ps1`, `capturer_fenetre.ps1`, `copier_reponse.ps1`) doit être annoncée visuellement, à trois niveaux complémentaires.

**Charte graphique (2026-08-18, remplace le style cyan/turquoise initial)** : "sérénité, halo lumineux, couleur douce dans les bleus clairs, polices arrondies, écriture blanche grosse" — appliquée à tous les éléments visuels (début/fin/bordure/indicateur/attente) :
- Fond : bleu-noir profond (`10,16,32`), opacité ~0.78 pour les overlays plein écran.
- Halo/glow : bleu clair doux (`130,180,255`), diffusé sur 7 couches à faible opacité (halo large et doux, pas un néon dur).
- Contour net : bleu très pâle quasi blanc (`210,230,255`).
- Texte : blanc pur, police **Calibri** (arrondie, disponible nativement sur Windows), grande taille, gras.
- Animation : lente (`phase += 0.03` à `0.045` selon l'élément) pour un effet apaisé, pas une pulsation nerveuse.

1. **Avant** de commencer une séquence d'actions sur le PC : `afficher_overlay_debut.ps1 -Agent <nom_agent> -Raison <texte court expliquant l'action>` (bloquant, 2s par défaut).
2. **Juste après**, une fois le bureau virtuel activé et les fenêtres concernées focus (`activer_bureau_cible.ps1`) : `demarrer_bordure_controle.ps1 -DossierEtat <chemin> -Agent <nom>` — bordure néon persistante autour de l'écran, signale en continu que l'agent contrôle le PC pendant toute la séquence (clics, défilement, capture).
3. **Avant chaque clic réel** (input ChatGPT, bouton copier) : géré automatiquement par `cliquer_fenetre.ps1`/`copier_reponse.ps1`/`coller_et_envoyer.ps1` via `afficher_indicateur_clic.ps1` — aucune action manuelle requise, l'icône s'affiche à l'endroit exact juste avant le clic.
4. **Après** la fin de la séquence : `arreter_bordure_controle.ps1 -DossierEtat <chemin> -Agent <nom>` (retire la bordure) puis `afficher_overlay_fin.ps1 -Agent <nom_agent>`, lancé via `Start-Process -WindowStyle Hidden` pour ne pas bloquer la suite du travail (auto-fermeture 2s, plus de bouton à cliquer).

Une "séquence" regroupe les actions PC consécutives d'un même geste logique (ex. tout le cycle défilement + repérage + clic + lecture presse-papier d'une récupération de réponse), pas chaque script individuel — sinon l'overlay de début/fin clignoterait à chaque appel. La bordure, elle, reste affichée en continu sur toute la durée de la séquence (elle n'a pas besoin d'être redémarrée entre chaque script).

## Récupération automatique d'une réponse (semi-automatique)

Décision utilisateur (2026-08-18) : le collage de la réponse de ChatGPT peut être automatisé (scroll + clic sur "copier"), mais l'exécution de cette réponse reste soumise à une confirmation explicite de l'utilisateur avant d'agir — pas de boucle totalement autonome où le texte de l'orchestrateur serait injecté directement dans la conversation Claude Code sans relecture humaine. Raison : ChatGPT devient sinon une source qui donne des instructions avec la même autorité qu'un message de l'utilisateur, sans point de contrôle avant exécution.

Procédure, une fois que l'utilisateur signale qu'une réponse est arrivée :

1. `defiler_fenetre.ps1 -TitreContient <texte> -AllerEnBas` — saute directement en bas de la conversation (clic neutre + touche `Fin`, un seul appel, pas besoin de boucler).
2. `capturer_fenetre.ps1` — vérifie visuellement que la ligne d'icônes d'actions (copier/partager/régénérer/...) est bien visible sans contenu en dessous, confirmant le bas de la conversation.
3. Sur cette capture, repérer la position du bouton "copier" (première icône, sous la dernière réponse) et calculer sa fraction X/Y par rapport aux dimensions de la fenêtre affichées par le script.
4. `copier_reponse.ps1 -PositionClicX <val> -PositionClicY <val> -DossierEtat <chemin> -Agent <nom>` — clique le bouton et écrit directement le contenu dans `_dernier_presse_papier.md` en un seul appel.
5. Lire ce fichier, résumer son contenu à l'utilisateur, **attendre sa confirmation explicite** avant d'exécuter quoi que ce soit.
6. Une fois confirmé : `log_echange.ps1 -Type instruction -FichierContenu <chemin de _dernier_presse_papier.md> -Resume <1 ligne>` pour l'archiver définitivement dans `echanges/`, puis exécuter le travail demandé comme au point 2 des Actions ci-dessous.

### Envoi automatique — convention

Après tout `log_echange.ps1`/`generer_reprise.ps1` qui produit un message **à destination de l'orchestrateur** (types `rapport` et `reprise`, jamais `instruction`), enchaîner avec `coller_et_envoyer.ps1` pour l'envoyer directement dans sa fenêtre, sans attendre que l'utilisateur colle à la main. C'est un confort qui s'ajoute au clipboard, jamais un remplacement : si `coller_et_envoyer.ps1` échoue (fenêtre introuvable ou ambiguë), le contenu reste dans le presse-papier et dans `echanges/` — l'utilisateur colle manuellement, aucun blocage.

## Suivi des tokens et anticipation de la limite de session (2026-08-18, Phase 1 de `roadmap_reprise_multicompte.md`)

`log_echange.ps1` appelle automatiquement `maj_usage.ps1 -DossierEtat <chemin> -Agent <nom> -CaracteresAjoutes <Contenu.Length>` après chaque archivage (instruction/rapport/reprise), qui cumule une estimation de tokens (`caractères / 4`, arrondi au supérieur) dans `<dossier_etat>/<agent>/usage.json` :
```
{ "TokensEstimes": <entier>, "SeuilTokens": <entier>, "DepuisLe": "AAAA-MM-JJ HH:MM" }
```
Seuil par défaut 60000, à ajuster par expérience réelle (`maj_usage.ps1 ... -SeuilTokens <val>` sur n'importe quel appel met à jour le seuil enregistré) — **aucune valeur fiable n'est connue au démarrage**, ce chiffre doit être corrigé au fil des sessions selon le moment réel où ChatGPT bloque. Une fois le seuil atteint, `log_echange.ps1` affiche une ligne `ALERTE : seuil de tokens estimes atteint ou depasse.` en sortie — signal à traiter comme un avertissement anticipé, pas une certitude de blocage imminent (l'estimation par caractères est grossière, ne tient pas compte de la tokenisation réelle ni des messages de l'utilisateur côté ChatGPT).

Pas d'OCR disponible pour détecter automatiquement un message de blocage ChatGPT ("You've reached...", limite de débit, etc.) affiché à l'écran : en cas de doute (alerte de seuil, ou réponse qui ne vient plus), utiliser `capturer_fenetre.ps1` puis lire l'image (`Read`) pour confirmer visuellement l'état réel avant de déclencher une bascule de compte.

`maj_usage.ps1 -DossierEtat <chemin> -Agent <nom> -Reinitialiser [-SeuilTokens <val>]` remet le compteur à zéro (prévu pour le moment où une bascule de compte a lieu, cf. phases suivantes de la roadmap) — appel manuel, non déclenché automatiquement pour l'instant.

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
- **`calibration.json`** — écrit par `maj_calibration.ps1`, jamais à la main : `{"PositionClicX", "PositionClicY", "CalibreLe"}` (fractions 0-1 de la largeur/hauteur de la fenêtre ciblée). Chargé automatiquement par `coller_et_envoyer.ps1` quand `-DossierEtat`/`-Agent` sont fournis. Absent par défaut tant qu'aucune calibration n'a eu lieu (comportement par défaut 0.5/0.93 conservé).
- **`calibration/`** — screenshots PNG horodatés produits par `capturer_fenetre.ps1`, un par calibration. Ne sont jamais réinjectés dans un prompt — sert uniquement à la lecture visuelle ponctuelle pour déterminer une position de clic.

## Calibration du clic (position du champ de saisie)

`coller_et_envoyer.ps1` clique à une position exprimée en fraction de la fenêtre ciblée (par défaut 0.5 / 0.93, en bas au centre). Cette position n'est valable que tant que la mise en page ne change pas — **une nouvelle conversation dans l'orchestrateur déplace souvent le champ de saisie** (pas d'historique = champ recentré verticalement, par exemple), ce qui fait échouer un clic calé sur l'ancienne position sans qu'aucune erreur ne remonte (le clic atterrit ailleurs sur la page, silencieusement).

Règle : **avant le tout premier envoi automatique d'une session** (initialisation ou reprise après expiration), demander explicitement à l'utilisateur de confirmer qu'une nouvelle conversation est bien ouverte et prête dans la fenêtre de l'orchestrateur. Une fois confirmé :

1. Appeler `capturer_fenetre.ps1 -DossierEtat <chemin> -Agent <nom>` (mêmes paramètres de ciblage que l'envoi prévu).
2. Lire l'image produite (`Read`) pour repérer visuellement le champ de saisie, et calculer sa position en fraction de la largeur/hauteur affichées par le script (ex. champ vers le bas, légèrement à gauche du centre → `PositionClicX` ≈ 0.4, `PositionClicY` ≈ 0.85).
3. Enregistrer via `maj_calibration.ps1 -DossierEtat <chemin> -Agent <nom> -PositionClicX <val> -PositionClicY <val>`.
4. Envoyer avec `coller_et_envoyer.ps1 -DossierEtat <chemin> -Agent <nom> [...]` — la calibration est chargée automatiquement.

Pour vérifier le ciblage avant validation définitive : `coller_et_envoyer.ps1 ... -SansEnvoi` (colle sans Entrée), puis capturer à nouveau via `capturer_fenetre.ps1` pour lire visuellement que le texte est bien dans le bon champ. Si c'est bon, valider avec `coller_et_envoyer.ps1 ... -SeulementValider` (Entrée seule, sans recliquer ni recoller) — jamais rappeler le script sans `-SeulementValider` à ce stade, sous peine de coller le contenu une deuxième fois.

**Pour tous les envois suivants de la même conversation** (pas de rechargement/nouvelle discussion entre-temps), ne pas recapturer : appeler directement `coller_et_envoyer.ps1 -DossierEtat <chemin> -Agent <nom>`, qui réutilise `calibration.json`. Ne recalibrer que si l'utilisateur signale une nouvelle conversation, un redimensionnement de fenêtre, ou un échec constaté (texte non arrivé dans le chat).

**Piège constaté (2026-08-18) : la position du champ de saisie diffère entre une conversation vide et une conversation avec des messages.** Sur une conversation vide, ChatGPT centre le champ verticalement (~Y 0.51). Dès qu'il y a au moins un échange, le champ redescend en bas de fenêtre (~Y 0.93-0.94). Une calibration faite sur une conversation vide casse silencieusement l'envoi suivant si la conversation a progressé entre-temps (le clic atterrit dans le texte affiché, `Ctrl+V`/Entrée n'ont aucun effet sur une zone non éditable — aucune erreur, mais rien n'est envoyé). Vérifier systématiquement après un envoi (recapture + lecture) que le contenu est bien arrivé, pas seulement que le script a rendu `Envoye : True` (qui ne certifie que l'appui sur Entrée, pas la réussite du collage préalable). En cas d'échec silencieux détecté : recalibrer sur l'état réel courant (conversation vide ou non), sans perte de contenu (`maj_calibration.ps1` + nouveau `-SansEnvoi`/`-SeulementValider`, cf. procédure ci-dessus) — le texte non délivré reste dans le presse-papier, aucune donnée perdue.

## Actions

### 1. Initialisation d'une mission

Si `<dossier_etat>/<nom_agent>/` n'existe pas encore : appeler `init_agent.ps1`. Générer ensuite le prompt d'amorçage pour la première session (rôle d'orchestrateur, contrainte de session limitée, format attendu des instructions) et l'archiver via `log_echange.ps1 -Type reprise`.

Le prompt d'amorçage doit toujours exiger explicitement que l'orchestrateur réponde en **un seul bloc Markdown prêt à copier, sans aucun commentaire hors bloc** — sinon l'utilisateur doit nettoyer manuellement le message avant de le coller dans Claude Code, ce qui coûte du temps et des tokens à chaque échange. Cette exigence doit être répétée dans chaque prompt de reprise (`generer_reprise.ps1`), pas seulement à l'amorçage.

Avant d'enchaîner avec `coller_et_envoyer.ps1`, suivre la procédure de calibration ci-dessus (nouvelle conversation = calibration obligatoire).

### 2. Réception d'une instruction de l'orchestrateur

Quand l'utilisateur colle un message reçu : l'archiver via `log_echange.ps1 -Type instruction -Resume <1 ligne>`, exécuter le travail demandé, puis `maj_etat.ps1` (dernier échange, prochaine action) et compléter `decisions.md`/`questions_ouvertes.md` si l'instruction en contient (append direct, ces deux fichiers ne passent pas par un script).

### 3. Compte-rendu vers l'orchestrateur

Après exécution, produire un message compact (pas un pavé de logs bruts) : ce qui a été fait, résultat, points nécessitant une décision. Archiver via `log_echange.ps1 -Type rapport -Resume <1 ligne>`, puis enchaîner avec `coller_et_envoyer.ps1 -DossierEtat <chemin> -Agent <nom>` pour l'envoyer directement (calibration existante réutilisée automatiquement, tant que la conversation n'a pas changé).

### 4. Session terminée — reprise

Déclenché explicitement par l'utilisateur ("session finie", "relance une session", ou équivalent). Appeler `generer_reprise.ps1` — il assemble le prompt, l'archive, tente le clipboard, incrémente le numéro de session et met à jour `etat.md`, sans composition manuelle. La nouvelle session s'ouvre dans une **nouvelle conversation** : suivre la procédure de calibration (nouvelle capture, pas de réutilisation de l'ancien `calibration.json`) avant d'enchaîner avec `coller_et_envoyer.ps1` ; à défaut de fenêtre détectée, le contenu reste disponible dans le presse-papier et dans `echanges/`.

### 5. Statut

Sur demande, afficher `etat.md` et `questions_ouvertes.md` de l'agent concerné sans rien modifier.

## Règles

- Ne jamais reconstruire un prompt de reprise à partir de la mémoire de la conversation Claude Code en cours : toujours via `generer_reprise.ps1`, à partir des fichiers `<dossier_etat>/<nom_agent>/*.md`.
- Ne jamais réinjecter `echanges/` en entier dans un prompt de reprise — `generer_reprise.ps1` ne prend que `etat.md`/`decisions.md`/`questions_ouvertes.md` et le dernier `_rapport.md`.
- `Set-Clipboard` est un confort, jamais une dépendance bloquante : le fichier écrit dans `echanges/` fait toujours foi.
- Aucune dépendance externe : PowerShell `Set-Clipboard` (déjà la convention du kit, cf. `.claude/commands/create_agent.md` étape 10), pas de bibliothèque tierce.
- Toute mise à jour de `etat.md` passe par `maj_etat.ps1`, jamais par `Write`/`Edit` direct — économie de tokens.
- `coller_et_envoyer.ps1` ne sert qu'à envoyer des messages **vers** l'orchestrateur (rapport, reprise) — jamais utilisé sur une instruction reçue de l'orchestrateur. En cas de doute sur la fenêtre ciblée (plusieurs correspondances, ambiguïté), le script échoue sans cliquer plutôt que de deviner.
- Ne jamais lancer `coller_et_envoyer.ps1` sur une nouvelle conversation sans calibration préalable — un clic mal placé sur une mise en page différente ne produit aucune erreur visible (le texte atterrit ailleurs sur la page), donc rien ne permet de le détecter automatiquement après coup.
- Ce mécanisme reste un outil de collaboration ponctuel, distinct de tout skill générique de conception de workflow multi-agents — il ne doit jamais devenir une dépendance obligatoire d'un tel skill.
