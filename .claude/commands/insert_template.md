---
description: Insère un template (templates/<nom>/) dans un projet cible, exécutable depuis le kit
argument-hint: "<chemin_projet_cible>" <nom_template> [dossier_destination]
model: sonnet
---

# /insert_template <chemin_projet_cible> <nom_template> [dossier_destination]

## Objectif

Copier le contenu d'un template du kit (`templates/<nom_template>/`) dans un
projet cible, en résolvant les placeholders génériques et sans jamais écraser
silencieusement un fichier déjà présent côté cible.

Cette commande vit dans le kit et n'est jamais copiée dans les projets
cibles : elle s'exécute toujours depuis le kit, projet cible en premier
argument. Généraliste : applicable à tout dossier `templates/<nom>/`
respectant la convention ci-dessous (`roberto`, `control_PC`, futurs
templates), pas seulement à un template particulier.

## Convention d'un template

- Tout fichier/dossier directement sous `templates/<nom_template>/` est
  copié tel quel côté cible, **sauf** un dossier `analysis/` à la racine du
  template : réservé au traçage côté kit (inventaire, captures de session,
  notes de conception), jamais copié.
- Un template ne contient que ce qui doit être livré : le tri
  conserver/génériciser/exclure se fait une fois, à la construction du
  template (`templates/<nom_template>/`), pas à chaque insertion.
- Placeholders génériques reconnus dans le contenu texte des fichiers
  copiés (jamais dans les fichiers binaires — images, `.sqlite`, `.png`,
  etc., copiés sans lecture) :

  | Placeholder | Résolu par |
  |-------------|------------|
  | `{{NOM_PROJET}}` | Nom du dossier racine du projet cible |
  | `{{ALIAS_PROJET}}` | Alias de la zone racine dans `<projet_cible>/.claude/zones.md` (cf. règle `{{ALIAS_RACINE}}` de `create_agent.md` : ne retenir que si la première ligne de `zones.md` pointe vers la racine elle-même) |
  | `{{DATE}}` | Date du jour (AAAA-MM-JJ) |

  Un fichier contenant un token `{{...}}` hors de cette liste bloque
  l'insertion de ce fichier précis (jamais de substitution devinée) : le
  signaler et s'arrêter avant toute écriture.

## [PREFLIGHT] — résolution, aucune écriture

1. Parser $ARGUMENTS. Le premier argument (chemin absolu du projet cible)
   peut contenir des espaces : s'il n'est pas entre guillemets, tester les
   préfixes croissants des tokens jusqu'à trouver un chemin dont
   `.claude/zones.md` existe. Extraire ensuite : nom du template (token
   suivant), dossier de destination optionnel (reste de la ligne).
   - Chemin projet introuvable : demander "Chemin absolu du projet cible ?"
     et s'arrêter.
   - Nom de template absent : demander "Nom du template
     (`templates/<nom>/`) ?" et s'arrêter.

2. Vérifier `<racine du kit>/templates/<nom_template>/` existe. Absent :
   lister les templates disponibles (sous-dossiers de `templates/` hors
   fichiers `*_TEMPLATE.md` isolés) et s'arrêter.

3. Vérifier `<projet_cible>/.claude/zones.md` existe. Absent → s'arrêter, le
   projet n'a pas encore été initialisé via `/init_projet`.

4. Résoudre le dossier de destination :
   - Fourni en argument → `<projet_cible>/<dossier_destination>`.
   - Absent → `<projet_cible>/ROBERTO` (dossier dédié qui centralise tous les
     templates insérés, créé s'il n'existe pas).

5. Lister récursivement `templates/<nom_template>/`, dossier `analysis/`
   exclu. Pour chaque fichier, calculer le chemin cible et vérifier s'il
   existe déjà : construire deux listes, **à créer** et **déjà présents**
   (jamais écrasés). Si **à créer** est vide → rien à faire, le template est
   déjà entièrement inséré : le signaler et s'arrêter.

## [COLLECTE] — résolution des placeholders, une question groupée si besoin

6. Résoudre `{{NOM_PROJET}}` (nom du dossier du projet cible) et
   `{{ALIAS_PROJET}}` (règle `zones.md` ci-dessus). Alias non déterminable :
   poser une question unique ("Quel alias utiliser pour `{{ALIAS_PROJET}}` ?")
   plutôt que d'inventer une valeur ou de laisser le champ vide.

7. Scanner le contenu texte des fichiers de la liste **à créer** à la
   recherche de tokens `{{...}}`. Tout token hors `NOM_PROJET`/
   `ALIAS_PROJET`/`DATE` : retirer ce fichier de la liste **à créer**,
   l'ajouter à une liste **bloqués** avec le token en cause. Ne jamais
   deviner une valeur de substitution.

## [ECRITURE] — toutes les écritures groupées

8. Pour chaque fichier de la liste **à créer** (liste **bloqués** exclue) :
   - Créer les dossiers intermédiaires manquants côté cible.
   - Fichier texte contenant des placeholders reconnus : copier le contenu
     avec substitution appliquée.
   - Fichier binaire ou sans placeholder : copie brute (octet à octet).

## [SORTIE]

9. Un seul récapitulatif :
   - Fichiers créés (compte, lien vers le dossier racine de destination).
   - Fichiers déjà présents et laissés intacts (liste, si non vide).
   - Fichiers bloqués par un placeholder inconnu (liste avec le token en
     cause, si non vide) — l'insertion de ces fichiers précis reste à
     terminer manuellement ou après correction du template.
   - Confirmation : "✅ Template <nom_template> inséré dans
     <dossier_destination>." (ou "partiellement inséré" si la liste
     **bloqués** n'est pas vide.)

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- Convention : toute règle liée à une phase précise de la Procédure ci-dessus doit la
     référencer explicitement par son ancre ([PREFLIGHT]/[COLLECTE]/[ECRITURE]/[SORTIE]),
     plutôt que par un numéro d'étape ou la position physique de cette zone. -->
<!-- SPECIFICITES PROJET : FIN -->
