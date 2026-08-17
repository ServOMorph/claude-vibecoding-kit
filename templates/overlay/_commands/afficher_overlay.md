---
description: Affiche l'overlay néon plein écran signalant la fin d'un traitement d'agent ou de zone
argument-hint: [message]
allowed-tools: Bash
---

# /afficher_overlay [message]

Affiche l'overlay plein écran (opacité réduite, contour néon bleu foncé
animé) avec le nom de la zone ou de l'agent courant, suivi du message fourni
ou de « J'ai fini !!! » par défaut.

## Procédure

1. Déterminer le nom de la zone ou de l'agent courant (alias dans `zones.md`
   ou nom de la zone active).
2. Vérifier que `../start_overlay.ps1` existe.
3. Lancer le script en arrière-plan avec une fenêtre PowerShell masquée :

```powershell
Start-Process -FilePath 'powershell.exe' `
  -ArgumentList @('-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', '<chemin-vers>\start_overlay.ps1', '-Name', '<nom_zone_ou_agent>', '-Message', "<message>", '-DurationSeconds', '5') `
  -WindowStyle Hidden
```

4. Ne pas attendre la fermeture de l'overlay : le script se ferme seul après
   `-DurationSeconds` ou sur intervention de l'utilisateur (`Esc` ou clic).
