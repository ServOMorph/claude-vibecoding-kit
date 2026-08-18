---
description: Initialise le template discord_com dans un projet cible (insertion + configuration guidée jusqu'à un bot opérationnel)
argument-hint: "<chemin_projet_cible>"
model: sonnet
---

# /init_discord_mode <chemin_projet_cible>

## Objectif

Rendre le contrôle Discord ↔ Claude Code opérationnel dans un projet cible : insérer le
template `discord_com`, puis guider la configuration jusqu'à un bot capable de se connecter
(token, channel_id, invitation OAuth2, Message Content Intent, dépendances Python).

Cette commande vit dans le kit et n'est jamais copiée dans les projets cibles : elle
s'exécute toujours depuis le kit, projet cible en argument. Elle délègue l'insertion des
fichiers à la même logique que `/insert_template <chemin_projet_cible> discord_com` — pas de
duplication de cette procédure, uniquement la configuration ajoutée en aval.

**Règle absolue sur le token** : le bot token Discord est un secret. Claude ne le demande
jamais dans le chat, ne le lit jamais (aucun `Read`/`Grep` affichant sa valeur) et ne l'écrit
jamais dans un fichier. Il vit exclusivement dans `discord_com/.env`, rempli par
l'utilisateur lui-même dans son éditeur. Toute vérification de présence côté Claude passe par
une commande shell dont la sortie ne contient jamais la valeur du token (ex. comparaison au
placeholder par défaut, résultat booléen uniquement).

## [PREFLIGHT] — résolution, aucune écriture

1. Résoudre `<chemin_projet_cible>` (même règle que `/insert_template` : gérer les chemins
   avec espaces par test de préfixes croissants jusqu'à trouver `.claude/zones.md`). Absent →
   demander le chemin et s'arrêter.
2. Vérifier `<projet_cible>/.claude/zones.md` existe. Absent → s'arrêter, le projet n'a pas
   encore été initialisé via `/init_projet`.
3. Localiser le dossier `discord_com/` déjà inséré côté cible, le cas échéant (chercher
   `discord_com/bot.py` sous la destination par défaut `<projet_cible>/ROBERTO/` puis, à
   défaut, à la racine du projet — ne jamais supposer un seul emplacement possible).
4. Si `discord_com/config_bot_discord.json` existe déjà avec `enabled: true` et que
   `discord_com/.env` contient une valeur de `DISCORD_BOT_TOKEN` différente du placeholder
   (vérifier par une commande shell qui ne renvoie qu'un booléen, jamais la valeur — ex.
   `grep -q "^DISCORD_BOT_TOKEN=colle_ton_token_ici$" discord_com/.env && echo VIDE || echo
   REMPLI`) : informer "discord_com déjà configuré dans ce projet (`<chemin>`)." et proposer
   de vérifier la connexion (`python discord_com/bot_manager.py status`) plutôt que de
   repartir de zéro. Ne poursuivre au-delà de cette étape que si l'utilisateur le demande
   explicitement.

## [INSERTION]

5. Insérer le template : appliquer la procédure `/insert_template <chemin_projet_cible>
   discord_com` telle que définie dans `.claude/commands/insert_template.md`
   ([PREFLIGHT]/[COLLECTE]/[ECRITURE]/[SORTIE] de cette commande, y compris la résolution des
   placeholders et la règle de non-écrasement). Ne pas réinventer cette logique ici.
6. Noter le dossier de destination résolu à l'étape précédente (`<destination>`) : il sert de
   base à toutes les commandes citées dans les étapes suivantes (`<destination>/discord_com/`).

## [CONFIGURATION] — guidée, une question à la fois, jamais de valeur inventée

7. Si `<destination>/discord_com/config_bot_discord.json` n'existe pas : le créer en copiant
   `config_bot_discord.example.json` (`enabled: false` par défaut tant que la configuration
   n'est pas complète). Si `<destination>/discord_com/.env` n'existe pas : le créer en
   copiant `.env.example` (jamais en construisant son contenu soi-même).
8. Demander à l'utilisateur de compléter **lui-même** `<destination>/discord_com/.env`
   (rappeler : Developer Portal → application → Bot → Add Bot / Reset Token → copier le
   token, puis le coller à la place du placeholder dans `.env`, dans son éditeur). Claude ne
   demande jamais le token dans le chat et ne touche jamais au contenu de `.env`. Attendre
   confirmation que c'est fait, puis vérifier uniquement par une commande shell à sortie
   booléenne (cf. étape 4) que le placeholder a été remplacé — jamais lire la valeur.
9. Demander l'**Application ID** (Developer Portal → application → General Information —
   valeur publique, pas un secret). Construire l'URL d'invitation OAuth2 :
   `https://discord.com/api/oauth2/authorize?client_id=<APPLICATION_ID>&permissions=68608&scope=bot`
   (`permissions=68608` = View Channel + Send Messages + Read Message History). La fournir à
   l'utilisateur et attendre confirmation que le bot a été invité sur le serveur cible avant
   de continuer.
10. Rappeler d'activer **Message Content Intent** (Developer Portal → application → Bot →
    Privileged Gateway Intents → activer → Save Changes) — sans cette étape, le bot se
    connecte mais ne peut lire le contenu des messages (`!ping`/`!help` restent muets).
    Attendre confirmation avant de continuer.
11. Demander le **channel_id** du salon cible (clic droit sur le salon en mode développeur →
    Copier l'identifiant). Écrire la valeur dans `channel_id`. Passer `enabled` à `true`.
12. Installer les dépendances :
    ```bash
    pip install -r <destination>/discord_com/requirements.txt
    ```

## [VALIDATION]

13. Lancer le bot en arrière-plan et vérifier la connexion :
    ```bash
    python <destination>/discord_com/bot_manager.py start
    python <destination>/discord_com/bot_manager.py status
    ```
    Statut `[KO]` ou erreur au lancement (`403 Forbidden`, `PrivilegedIntentsRequired`) →
    diagnostiquer avant de continuer : `403` = invitation OAuth2 incomplète ou permission
    "Voir le salon" manquante ; `PrivilegedIntentsRequired` = Message Content Intent non
    activé côté portail (voir `<destination>/discord_com/README_DISCORD_COM.md` § Dépannage).
14. Si le statut est `[OK]` : demander à l'utilisateur d'envoyer `!ping` dans le salon
    configuré pour confirmer la réception, avant de conclure.

## [SORTIE]

15. Un seul récapitulatif :
    - Fichiers insérés (compte, lien vers `<destination>/discord_com/`).
    - Configuration complétée (`enabled: true`, channel_id renseigné) — jamais réafficher le
      token.
    - Statut de connexion validé (ou point de blocage restant, avec la piste de dépannage
      correspondante).
    - Prochaines étapes : `python <destination>/discord_com/bot_manager.py start` pour
      relancer le bot après un redémarrage, puis `/discord_loop` dans une conversation Claude
      Code pour activer la boucle de contrôle native.
    - Rappel sécurité : `.env` ne doit jamais être commité (déjà couvert par `.gitignore` si
      le template a été inséré correctement — vérifier sa présence dans
      `<destination>/discord_com/DISCORD_SECURITY.md` sinon le signaler). Rappeler aussi que
      le token ayant transité par la session courante (avant cette mise à jour du workflow)
      doit être régénéré (Developer Portal → Bot → Reset Token) par précaution.

<!-- SPECIFICITES PROJET : DEBUT (préservé par /update, ne pas toucher hors de ce bloc) -->
<!-- Convention : toute règle liée à une phase précise de la Procédure ci-dessus doit la
     référencer explicitement par son ancre ([PREFLIGHT]/[INSERTION]/[CONFIGURATION]/
     [VALIDATION]/[SORTIE]), plutôt que par un numéro d'étape ou la position physique de
     cette zone. -->
<!-- SPECIFICITES PROJET : FIN -->
