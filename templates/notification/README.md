# Notification barre des taches

Notification systray (icone + bulle Windows), pres de la barre des taches.
Signale visuellement la fin d'un traitement d'agent ou de zone, sans
recouvrir l'ecran (contrairement au template `overlay`).

## Contenu affiche

- Titre de la bulle : nom de l'agent ou de la zone qui a declenche la
  notification.
- Corps de la bulle : « J'ai fini !!! » (ou message fourni).

## Comportement au clic

Un clic sur la notification :
1. remet au premier plan la fenetre du processus qui a lance le script
   (fenetre du terminal/editeur de l'agent) ;
2. fait disparaitre la notification.

Identification de la fenetre a focaliser : a chaque lancement, le script
remonte la chaine des processus parents (jusqu'a 20 niveaux) et retient le
premier processus dote d'une fenetre principale (`MainWindowHandle`). Aucun
parametre supplementaire n'est necessaire pour cela.

## Lancement

```powershell
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '<chemin-vers>\start_notification.ps1', '-Name', '<nom_agent_ou_zone>', '-Message', "J'ai fini !!!", '-DurationSeconds', '5') `
  -WindowStyle Hidden
```

Parametres :

| Parametre | Defaut | Role |
| --- | --- | --- |
| `-Name` | `Agent` | Nom affiche en titre de la bulle (agent ou zone a l'origine de la notification) |
| `-Message` | `J'ai fini !!!` | Texte affiche dans le corps de la bulle |
| `-DurationSeconds` | `0` | `0` : le processus reste actif jusqu'a clic manuel. Valeur positive : fermeture forcee du processus apres ce delai si aucun clic n'a eu lieu |

Limite connue : Windows (a partir de Windows 10) ignore la duree d'affichage
visuelle demandee a l'API et gere lui-meme le temps que la bulle reste
visible a l'ecran ; `-DurationSeconds` controle ici la fermeture du
processus en arriere-plan, pas la duree d'affichage a proprement parler.

## Organisation

- `start_notification.ps1` : script d'affichage (WinForms, NotifyIcon +
  bulle systray).
- `_commands/afficher_notification.md` : commande d'insertion pour
  declencher la notification depuis une zone du projet cible.
