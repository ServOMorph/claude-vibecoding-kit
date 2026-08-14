---
description: Prend le contrôle confirmé d'une fenêtre déjà ouverte à droite ou ouvre une application cible
argument-hint: [application]
allowed-tools: Bash
---

# /prendre_controle_pc [application]

Prendre le contrôle d'une fenêtre dans la moitié droite de l'écran. Sans argument, la cible est simplement la fenêtre déjà affichée dans cette zone. Avec un argument, ouvrir d'abord l'application cible.

Exemple : `/prendre_controle_pc opencode` ouvre OpenCode dans la zone droite et active le halo associé.

## Applications prises en charge

| Argument | Application | Dossier de macros |
| --- | --- | --- |
| `opencode` | OpenCode | `../macros/opencode/` |

## Procédure

1. Si aucun argument n'est fourni, cibler la fenêtre déjà affichée dans la moitié droite de l'écran, sans déduire ni sélectionner son application à partir du contexte ou d'une liste de processus. Si aucune fenêtre n'est visible dans cette zone, l'indiquer et s'arrêter.
2. Si un argument est fourni, résoudre l'application demandée. Pour `opencode`, le nom à saisir est `opencode`, puis ouvrir l'application selon la macro générique [`../macros/_shared/ouvrir_application_windows.md`](../macros/_shared/ouvrir_application_windows.md) : touche `Windows`, saisie du nom, puis `Entrée`. Une macro dédiée prévaut si elle définit une autre méthode.
3. Placer la fenêtre cible au premier plan dans la moitié droite de l'écran.
4. Demander une confirmation explicite à l'utilisateur pour prendre le contrôle de la fenêtre actuellement affichée à droite : « Voulez-vous que je prenne le contrôle de cette fenêtre ? »
5. Attendre la réponse écrite de l'utilisateur. Sans réponse affirmative explicite, ne pas lancer le workflow et ne pas interagir avec la fenêtre.
6. Vérifier que `../start_control_pc.ps1` existe et arrêter toute instance précédente lancée avec ce script.
7. Relever la position et les dimensions de la fenêtre cible, puis lancer le script en arrière-plan avec une fenêtre PowerShell masquée. Le halo doit toujours être actif avant la première interaction :

```powershell
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '<chemin-vers>\start_control_pc.ps1', '-WindowLeft', '<x>', '-WindowTop', '<y>', '-WindowWidth', '<largeur>', '-WindowHeight', '<hauteur>', '-LogFile', '<chemin-vers>\logs\control.log') `
  -WindowStyle Hidden
```

8. Confirmer que le workflow est actif et que l'application cible est celle affichée dans la zone droite.
   Chaque action significative doit être ajoutée au journal de session `../logs/control.log` au format `[AAAA-MM-JJ HH:MM:SS] <événement>` ; le halo l’affiche automatiquement dans sa barre basse.
9. Initialiser, si besoin, la base SQLite `../database/control_pc.sqlite` à partir de [`../database/schema.sql`](../database/schema.sql).
10. Identifier l'application par un identifiant stable (`slug`) et enregistrer ou mettre à jour sa fiche : nom affiché, titre de fenêtre, URL ou autre signature visuelle, date de dernière observation.
11. Après chaque écran ou interaction vérifiée, ajouter une observation liée à l'application : type d'écran/action, résumé factuel, niveau de preuve (`observé`, `confirmé par source`, `à vérifier`) et chemin vers la capture ou le journal associé.
12. Lorsqu'une macro est créée ou validée, l'enregistrer dans la même base avec son application, sa finalité, son chemin sous `../macros/<application>/` et son statut (`brouillon`, `validée`, `désactivée`).
13. À chaque nouveau comportement reproductible découvert, créer ou mettre à jour sa macro Markdown dans `../macros/<application>/`, puis référencer son identifiant dans `../macros/README.md` et dans la base. Réutiliser une macro existante au lieu de dupliquer sa séquence.
14. Pour une séquence longue, créer un workflow dans `../workflows/` qui orchestre les identifiants des macros concernées dans l'ordre, avec ses préconditions, ses points d'arrêt et son résultat attendu.
15. Ne jamais présenter une information « à vérifier » comme un comportement confirmé et ne jamais inscrire de donnée personnelle capturée à l'écran dans la base.

## Base de connaissances applicative

La base `../database/control_pc.sqlite` conserve les connaissances réutilisables de contrôle :

| Table | Contenu |
| --- | --- |
| `applications` | Empreintes permettant de reconnaître une application lors d'une prochaine session |
| `discoveries` | Écrans, contrôles, préconditions, risques et preuves relevés pendant l'exploration |
| `macros` | Macros associées à une application et état de leur validation |

Les captures et journaux restent des fichiers ; la base ne stocke que leurs chemins relatifs.

## Organisation des macros

- [`../macros/README.md`](../macros/README.md) est l’index global des macros.
- Chaque application possède son dossier `../macros/<application>/`.
- Chaque macro indique son identifiant, ses préconditions, ses étapes, ses risques, son point d’arrêt et son statut de validation.
- Les workflows composés sont stockés dans `../workflows/` et référencent les identifiants de macros, jamais leur contenu dupliqué.

## Comportement attendu

- La zone visuelle couvre exclusivement la moitié droite de l'écran.
- Les contours sont placés légèrement à l'extérieur de cette zone, qui reste libre pour les clics.
- La barre basse violette sombre affiche les logs sélectionnés, un par un.
- Chaque nouveau log de session apparaît immédiatement dans la barre basse, puis les logs précédents défilent.
- Les macros utilisées doivent appartenir au sous-dossier de l'application cible dans `../macros/`.
- Les informations vérifiées et les macros associées sont persistées dans la base de connaissances applicative.
- Une confirmation explicite de l'utilisateur est obligatoire avant toute prise de contrôle de fenêtre.
- La touche `Esc` annule immédiatement le workflow.
