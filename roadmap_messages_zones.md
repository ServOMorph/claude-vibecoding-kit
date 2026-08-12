# Roadmap — Messages entrants par zone (kit → projet cible, sens unique)
Objectif : permettre d'écrire, depuis une session du kit, un message immédiat (pas d'attente de `/close`) à destination d'une zone (agent ou racine) d'un projet cible, lu automatiquement à son prochain `/start`.
Créée le : 2026-08-12

---

## Cadrage (à lire avant Phase 1, ne pas supprimer)

**Sens de communication** : kit → zone d'un projet cible uniquement. Pas de retour zone → kit (distinct de l'expérimentation "synthèse agents" de `jeu_zombies`, qui va dans l'autre sens et reste hors périmètre de cette roadmap).

**Deux niveaux** (décision du 2026-08-12, en cours de session) :

| | Niveau urgent | Niveau normal |
|---|---|---|
| Fichier | `<dossier_zone>/_contexte/urgent.md` | `<dossier_zone>/_contexte/messages.md` |
| Lu par | instruction dans `CLAUDE.md`, avant toute action significative (écriture/modif de fichier, commit) en cours de session | étape dédiée dans `/start <zone>` |
| Cas d'usage | l'agent tourne déjà, il faut l'avertir avant qu'il aille plus loin dans une direction obsolète | changement à connaître à la prochaine reprise, pas bloquant dans l'immédiat |
| Coût | vérifié plusieurs fois par session, doit rester quasi gratuit à checker | vérifié une fois par `/start` |

**Format commun aux deux fichiers** (minimiser les tokens, une ligne par entrée, pas d'en-tête markdown) :
```
[AAAA-MM-JJ] <message>
```

**Mécanisme retenu** :
- Les deux fichiers sont absents par défaut, créés à la première écriture (pas de génération systématique par `/create_agent`/`/init_projet`).
- Écriture : directe, par une session du kit, dès qu'une modification concerne cette zone — pas de nouvelle commande, pas d'étape `/close` à attendre côté kit. Urgent vs normal = jugement au moment de l'écriture (ça bloque une action en cours vs ça peut attendre le prochain `/start`).
- Lecture `urgent.md` : nouvelle section courte dans `CLAUDE.md` (kit + template) — instruction "avant toute action significative (écriture, modification de fichier, commit), vérifier `_contexte/urgent.md` du dossier de travail courant ; s'il est non vide, le traiter en priorité puis le vider immédiatement."
- Lecture `messages.md` : nouvelle étape dans `/start <zone>` (template + kit), après l'étape 2b (`agent_role.md`) : si `_contexte/messages.md` existe et n'est pas vide, le charger et l'afficher avant `signals.md`, puis le vider.
- Portée : agents ET zone racine (un seul mécanisme par niveau, pas de cas particulier — `CLAUDE.md` et `start.md` sont déjà partagés entre toutes les zones d'un projet).
- Propagation : via `/update` (`start.md` et `CLAUDE.md` sont déjà recopiés/mergés depuis `templates/` par les étapes 5/6 d'`update.md`, aucune modification d'`update.md` nécessaire).

**Risque identifié à surveiller (Phase 2)** : si le projet cible n'a pas encore reçu cette version de `CLAUDE.md`/`start.md` via `/update`, un message écrit dans `urgent.md` ou `messages.md` restera invisible (silencieusement — l'ancienne version ignore ces fichiers). Pas de garde automatique prévue pour l'instant : à vérifier (version kit du projet dans `DEPLOYMENTS.md`) avant d'écrire un message urgent en particulier.

---

**Stratégie de déploiement** : implémentation d'abord en pilote isolé sur `Roberto2` (`D:\ServOMorph\Roberto2`, alias `roberto2`, un seul zone racine actuellement), pas dans les templates du kit. Propagation au kit (templates + `.claude/` du kit + autres projets) seulement après validation en conditions réelles.

## Phase 1 — Pilote sur Roberto2 [TODO]
- [ ] Niveau normal : ajouter l'étape de lecture/affichage/purge de `_contexte/messages.md` dans `D:\ServOMorph\Roberto2\.claude\commands\start.md` (bloc "Spécificités projet", pas le corps générique, pour rester isolé du template tant que ce n'est pas validé).
- [ ] Niveau urgent : ajouter une section courte dans `D:\ServOMorph\Roberto2\.claude\CLAUDE.md` (section "Spécificités projet") — instruction de vérification de `_contexte/urgent.md` avant toute action significative.
- [ ] Test à blanc : écrire un `messages.md` et un `urgent.md` de test dans `D:\ServOMorph\Roberto2\_contexte\`, vérifier lecture/purge des deux (le second avant une action significative simulée, pas seulement à `/start`).

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Validation en conditions réelles [TODO]
- [ ] Depuis une session du kit, écrire un message réel dans `messages.md` (niveau normal) de Roberto2, lancer `/start roberto2` dans le projet cible, vérifier affichage + purge.
- [ ] Depuis une session du kit, écrire un message réel dans `urgent.md` (niveau urgent) pendant qu'une session tourne dans Roberto2, vérifier qu'il est capté avant l'action significative suivante.
- [ ] Bilan : garder tel quel, ajuster (format, fréquence de check, position dans les fichiers), ou écarter.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Déploiement kit (si validé) [TODO]
- [ ] Retirer le pilote du bloc "Spécificités projet" de Roberto2, promouvoir en étape/section native dans `templates/.claude/commands/start.md` et `templates/.claude/CLAUDE.md`.
- [ ] Répercuter dans `.claude/commands/start.md` et `.claude/CLAUDE.md` (kit).
- [ ] `/doc_sync` : `CHANGELOG.md`, `README.md`, `Protocole_start_close_context.md`.
- [ ] Décider si une propagation `/update all` immédiate est utile ou si le mécanisme se diffuse au fil des `/update` normaux.
