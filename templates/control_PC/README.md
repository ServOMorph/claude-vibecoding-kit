# Control PC

Template pour organiser les macros de contrôle du PC.

## Règles fondamentales

- La prise de contrôle cible exclusivement la moitié droite de l'écran.
- La touche `Esc` annule immédiatement toute prise de contrôle ou macro en cours.
- Un halo violet sombre, légèrement animé, encadre en permanence la zone contrôlée afin de la distinguer du reste de l'écran.
- La barre basse affiche un log à la fois, sur un fond neutre sombre dédié à la lisibilité.
- Toute prise de contrôle de fenêtre exige une confirmation explicite de l'utilisateur.

Le script `start_control_pc.ps1` accepte les paramètres `WindowLeft`, `WindowTop`, `WindowWidth` et `WindowHeight` afin d’encadrer exactement la fenêtre contrôlée.

## Organisation

- `macros/` : macros classées par usage.
