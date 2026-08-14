# Analyse de l’application « Appli TSA SDI TDAH »

## Périmètre et méthode

Analyse menée le 2026-08-14 dans la fenêtre droite : Chrome, onglet `tsa-scaffold`, servi localement sur `172.28.40.1:5175`.

La découverte combine :

- des captures périodiques de la moitié droite avec détection de zones candidates ;
- des clics uniques journalisés, toujours suivis d’une capture avant/après ;
- la lecture des tests manuels et du code local de `D:\ServOMorph\Appli_TSA_SDI_TDAH`, uniquement pour compléter les parcours non exercés sans créer, importer ou supprimer de données.

Les artefacts bruts sont dans [`session_02/`](session_02/) : captures, zones annotées, observations JSONL et journal de chaque clic.

## État exploré

Le parcours de référence utilisé est `Adulte`. Le niveau d’énergie a été explicitement ignoré afin de ne pas enregistrer une valeur arbitraire.

Parcours observé :

```text
Bienvenue
  → choix du profil (Adolescent | Étudiant | Adulte)
  → énergie du jour (1 à 12 | Ignorer)
  → Accueil
       ├─ Réception
       ├─ Paramètres
       └─ Outils : Comptes | To Do | Budget
```

Écrans visuels de référence :

- [Bienvenue](session_02/zones_005.png)
- [Choix du profil](session_02/zones_015.png)
- [Énergie](session_02/zones_034.png)
- [Accueil](session_02/zones_045.png)
- [Paramètres](session_02/zones_060.png)

## Accueil

L’accueil affiche :

- le profil courant (`AuDHD` dans l’état observé) ;
- l’état d’énergie ;
- un accès « Mode surcharge » ;
- le résumé de la planification et de la tâche du jour ;
- trois widgets : `Comptes`, `To Do` et `Budget` ;
- une navigation basse : `Réception`, `Accueil`, `Paramètres` et `+`.

Le widget `Comptes` ouvre une saisie rapide de dépense. Dans l’état vierge observé, aucune catégorie de dépense n’existe : l’application bloque donc la saisie et affiche l’alerte « Aucune catégorie de dépense ». Aucune donnée n’a été créée pendant ce test.

Le widget `To Do` a également été ouvert : la liste est vide et propose « Ajouter un élément ». Un bouton `×` est présent pour supprimer la liste ; il n’a pas été utilisé. Les tests manuels confirment qu’il doit déclencher une confirmation avant suppression.

Le code et les tests confirment que :

- `Mode surcharge` ouvre un centre de récupération ;
- `To Do` est une liste fournie par défaut ;
- le Budget est géré comme un outil dédié ;
- le bouton `+` ne doit proposer que la création d’une nouvelle liste, les outils annoncés « bientôt disponibles » restant informatifs.

## Paramètres

Les paramètres proposent quatre sections.

### Profil

L’écran indique le type de profil sélectionné (`Adulte`) et précise que les données de profil sont stockées localement sur l’appareil.

### Accessibilité

L’écran expose, sans modification effectuée lors de l’analyse :

- taille de texte : `Petite`, `Normale` (état observé) ou `Grande` ;
- case « Réduire les animations » ;
- case « Mode sombre » ;
- couleur d’ambiance.

Les tests manuels précisent que la couleur d’ambiance teinte le badge énergie de la barre haute et que ce badge n’affiche alors que l’icône et les chiffres.

### Confidentialité

L’écran annonce :

- stockage uniquement local, sans envoi vers un serveur externe ;
- absence de cookie de tracking, d’analyse comportementale et de compte obligatoire ;
- action irréversible « Supprimer mes données ».

Cette action n’a pas été ouverte ni exécutée.

### Export et import

Deux flux sont disponibles :

- `Exporter en JSON` : téléchargement de l’intégralité des données dans un fichier portable, présenté comme conforme au droit d’accès RGPD ;
- `Importer un fichier JSON` : restauration d’une sauvegarde, avec remplacement définitif des données locales existantes.

Ni l’export ni l’import n’ont été exécutés. Les tests manuels indiquent qu’un import peut restaurer les listes, tâches, budget, énergie et les entrées d’outils manquantes dans une sauvegarde ancienne.

## Outils et capacités confirmées par les sources locales

| Domaine | Capacités confirmées | Risques d’écriture |
| --- | --- | --- |
| Réception / listes | Création de liste, ouverture de listes, suppression avec confirmation, ajout d’éléments et rubriques | Création et suppression de données |
| To Do | Liste par défaut, éléments et sous-tâches | Création, modification et suppression |
| Budget | Catégories revenu/dépense, périodes semaine/mois, dépenses, comptes, dépôts et retraits | Données financières locales, suppressions avec confirmation selon le cas |
| Mode surcharge | Centre de récupération et interface simplifiée | Changement d’état de l’interface |
| Paramètres | Profil, accessibilité, confidentialité, import/export | Préférences, effacement ou remplacement de données |

Le Budget exige une catégorie de dépense avant la saisie rapide depuis l’accueil. La configuration de Budget permet en outre de créer/renommer/supprimer des comptes, de créer des catégories et d’ajouter des dépôts ou retraits. Ces actions n’ont pas été explorées en UI car elles modifient les données.

## Actions réalisées et actions exclues

Réalisées :

1. ouverture du parcours d’accueil ;
2. sélection locale du profil `Adulte` ;
3. choix `Ignorer` pour l’énergie ;
4. consultation de Profil, Accessibilité, Confidentialité, Export/import ;
5. ouverture de l’alerte de précondition du widget Comptes, puis fermeture.

Exclues volontairement :

- `Reset DB` ;
- suppression de toutes les données ;
- import ou export de JSON ;
- création, suppression ou modification d’éléments de liste ;
- création de catégories, comptes, dépenses, dépôts ou retraits ;
- changement de réglage d’accessibilité ou de confidentialité.

## Limites et suite recommandée

La découverte visuelle a validé le parcours de référence et les écrans de paramètres. Elle ne couvre pas encore, dans une vraie session utilisateur, les variantes `Adolescent` et `Étudiant`, les listes existantes, les formulaires de Budget remplis, ni les dialogues de confirmation de suppression.

Pour poursuivre sans risquer les données actuelles, importer une sauvegarde de test explicitement désignée par l’utilisateur ou travailler dans un profil navigateur isolé. Cela permettrait ensuite de valider de bout en bout les créations, suppressions, import/export et les variantes de profil.

## Fonctionnement de l’agent de découverte

[`../discovery/discover_right_window.py`](../discovery/discover_right_window.py) :

- capture uniquement la moitié droite ;
- choisit la première fenêtre au premier plan couvrant substantiellement cette zone ;
- produit une image annotée de zones visuellement candidates ;
- journalise les variations d’écran ;
- n’émet aucun clic en mode observation ;
- exige `--confirm-click` pour un clic unique, dont il conserve les captures avant/après ;
- s’arrête avec `Esc`.

Les zones détectées ne sont pas considérées comme des éléments interactifs fiables : l’analyse d’image sert d’assistance, tandis que les attributs d’accessibilité Windows devront être ajoutés pour une navigation réellement sémantique.

## Halo de contrôle

Le halo est maintenant lancé avec la géométrie réelle de la fenêtre cible (`953,0 — 974×1039` pour Chrome au moment du test), plutôt que sur la moitié droite entière. Il encadre donc la fenêtre, affiche ses logs dans la barre basse et reste présent avant chaque interaction. La touche `Esc` l’arrête immédiatement.
