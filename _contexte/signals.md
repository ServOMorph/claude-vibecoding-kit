# Signals — claude-vibecoding-kit (MAJ 2026-07-14)

## Actions ouvertes
- Aucune

## Questions ouvertes
- Aucune

## Échéances
- Aucune

## Blocages
- Aucun

## Contexte chaud
- `processus-base-connaissances-markdown.md` : fichier non tracké présent à la racine, origine inconnue — non touché cette session, à clarifier si pertinent
- `README.md` : corruption d'encodage pré-existante (double UTF-8) sur l'ensemble du fichier hors la ligne corrigée cette session — à traiter dans une session dédiée si gênant

## Dernière session (2026-07-14)
<!-- Écrasé intégralement par /close. Synthèse < 25 lignes. -->

# Session du 2026-07-14

## Décisions prises
- `ollama_call.sh` réécrit sans dépendance `jq` (encodage/décodage JSON via `python`/`python3`), erreurs HTTP Ollama remontées explicitement au lieu d'un échec silencieux.
- Modèle Ollama par défaut changé de `gemma3:4b` (jamais installé) à `gemma4:e4b`, override toujours possible via `OLLAMA_MODEL`.
- Bug corrigé dans `/update` : `ollama_call.sh` n'était jamais propagé vers les projets cibles — ajouté à la table de copie et aux commits de la procédure.

## Livrables produits ou modifiés
- `templates/ollama_call.sh`, `.claude/commands/update.md` + copie `templates/`, `CHANGELOG.md` (v2.10), `Protocole_start_close_context.md`, `README.md` (ligne prérequis)
- 6 projets déployés mis à jour vers kit v2.10 (robert-ia, jeu, Appli_TSA_SDI_TDAH, jegeekutile, SérénIATech_dev, visioaide), migration des sections "Spécificités projet" propres à chacun quand nécessaire

## Hypothèses validées / invalidées
- VALIDE : la table de copie de `/update` ne couvrait pas `ollama_call.sh` — confirmé en base de code, corrigé

## Prochaine étape exacte
Aucune action de suite identifiée.

## Question bloquante pour la session suivante
Aucune
