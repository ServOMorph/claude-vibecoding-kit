---
description: Affiche une notification pres de la barre des taches signalant la fin d'un traitement d'agent ou de zone
argument-hint: [message]
allowed-tools: Bash
---

# /afficher_notification [message]

Affiche une notification systray (icone + bulle Windows) avec le nom de la
zone ou de l'agent courant, suivi du message fourni ou de « J'ai fini !!! »
par defaut. Un clic sur la notification la fait disparaitre et remet la
fenetre de l'agent au premier plan.

## Procedure

1. Determiner le nom de la zone ou de l'agent courant (alias dans `zones.md`
   ou nom de la zone active).
2. Verifier que `../start_notification.ps1` existe.
3. Lancer le script en arriere-plan avec une fenetre PowerShell masquee :

```powershell
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '<chemin-vers>\start_notification.ps1', '-Name', '<nom_zone_ou_agent>', '-Message', "<message>") `
  -WindowStyle Hidden
```

4. Ne pas attendre la fermeture de la notification : le script reste actif
   jusqu'au clic de l'utilisateur (comportement par defaut, `-DurationSeconds`
   non fourni).
