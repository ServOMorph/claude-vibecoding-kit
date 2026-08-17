# Overlay

Overlay plein écran, opacité réduite (le contenu affiché derrière reste
visible), avec un contour néon bleu foncé animé. Signale visuellement la fin
d'un traitement d'agent ou de zone.

## Contenu affiché

- Nom de l'agent ou de la zone qui a déclenché l'overlay.
- En dessous : « J'ai fini !!! ».

## Lancement

```powershell
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '<chemin-vers>\start_overlay.ps1', '-Name', '<nom_agent_ou_zone>', '-Message', "J'ai fini !!!", '-DurationSeconds', '5') `
  -WindowStyle Hidden
```

Paramètres :

| Paramètre | Défaut | Rôle |
| --- | --- | --- |
| `-Name` | `Agent` | Nom affiché en premier (agent ou zone à l'origine de l'overlay) |
| `-Message` | `J'ai fini !!!` | Texte affiché en dessous du nom |
| `-DurationSeconds` | `5` | Fermeture automatique après ce délai. `0` : reste affiché jusqu'à fermeture manuelle |

Fermeture manuelle : touche `Esc` ou clic n'importe où sur l'overlay.

## Organisation

- `start_overlay.ps1` : script d'affichage (WinForms, overlay plein écran unique).
- `_commands/afficher_overlay.md` : commande d'insertion pour déclencher l'overlay depuis une zone du projet cible.
