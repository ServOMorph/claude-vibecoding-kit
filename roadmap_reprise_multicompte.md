# Roadmap — Reprise automatique multi-compte (chatgpt-orchestrateur)
Objectif : détecter la fin de session ChatGPT (limite atteinte), et relancer automatiquement une nouvelle conversation dans une autre fenêtre Chrome / autre compte Google, sans perte de contexte pour l'agent orchestré.
Créée le : 2026-08-18

Comptes Google autorisés (mapping profil Chrome établi le 2026-08-18) :
- Capet lulu → `Profile 8` (capetlulu.se@gmail.com)
- Funky Yogi → `Profile 1` (funkyyogi.music@gmail.com)
- Je Geek Utile → `Profile 28` (jegeekutile.rec@gmail.com)
- Le cerf qui fait Meuh → `Profile 16` (lecerfquifaitmeuh@gmail.com)
- Moulin du Sud → `Profile 9` (moulindusud33@gmail.com)
- Morphéus 1.4 → `Default` (morpheus.realisation@gmail.com)
- Raphael Richard (3 comptes) → `Profile 2` (6933raph6933@gmail.com), `Profile 6` (raphael.richard.se@gmail.com), `Profile 38` (sereniatech33@gmail.com)
- Rayonne Toi → `Profile 14` (rayonnetoi@gmail.com)
- ServOMorph → `Profile 3` (servomorph14@gmail.com)
- Temps pèche pas → `Profile 17` (tempspechepas@gmail.com)
- TRIPhase → `Profile 5` (triphase.webradio@gmail.com)

Tout autre profil Chrome présent sur le poste est hors périmètre, ne jamais l'utiliser.

---

## Phase 1 — Suivi des tokens et détection de limite [FAIT]
- [x] `maj_usage.ps1` : incrémente une estimation de tokens (chars/4, envoyés+reçus) dans `<dossier_etat>/<agent>/usage.json`, appelé automatiquement par `log_echange.ps1`
- [x] Seuil d'alerte configurable dans `usage.json` (valeur initiale arbitraire, à corriger au fil des sessions réelles — pas de valeur fiable connue au départ)
- [x] Procédure de confirmation visuelle d'un blocage : réutiliser `capturer_fenetre.ps1` (pas de script dédié — pas d'OCR disponible, la lecture reste manuelle par l'agent), documentée en complément du seuil de tokens qui donne l'alerte anticipée
- [x] Documentation dans `SKILL.md` : section dédiée, limites connues (pas de détection texte automatique fiable, estimation de tokens approximative)

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 2 — Rotation de compte Google [FAIT]
- [x] Fichier de config `comptes_google.json` (mapping nom compte → dossier profil Chrome, liste autorisée figée ci-dessus) dans `skills/chatgpt-orchestrateur/scripts/`
- [x] `ouvrir_nouveau_compte.ps1` : lance une nouvelle fenêtre Chrome avec `--profile-directory=<X>`, navigue vers `https://chatgpt.com`
- [x] Suivi des comptes déjà utilisés dans la mission courante — conception évoluée en cours de session : `comptes_usage.json` (par agent, un seul fichier faisant à la fois office de round-robin et de suivi de tokens par compte : `statut` actif/inactif/epuise, `tokensEstimes`) + `compte_actif.json` (pointeur du compte courant), plus riche que le `comptes_utilises.json` initialement prévu
- [x] Test réel : ouverture effective d'une fenêtre sur le compte "Capet lulu", vérification visuelle (capture) que ChatGPT est bien chargé et connecté — confirmé, mais quota partiel déjà atteint sur ce compte constaté au passage (fichiers/images/analyse indisponibles jusqu'à réinitialisation)

**Blocage découvert pendant le test réel, à traiter avant la Phase 3** : le clic automatique (`SetForegroundWindow` + `mouse_event`) peut échouer silencieusement et atterrir sur une autre fenêtre que celle ciblée (constaté : clic visant Chrome atterri sur VS Code/Claude Code lui-même) — cf. section dédiée de `SKILL.md`. Aucun correctif fiable identifié.

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 3 — Calibration et vérification dans la nouvelle fenêtre [TODO]
- [ ] Résoudre ou contourner le risque de vol de focus (`SetForegroundWindow`) découvert en Phase 2, avant d'automatiser tout enchaînement de clics dans une nouvelle fenêtre
- [ ] Enchaîner sur la procédure de calibration existante (`capturer_fenetre.ps1`/`maj_calibration.ps1`) adaptée à un nouveau `-TitreContient` (nouvelle fenêtre Chrome, nouveau compte)
- [ ] Vérification qu'une nouvelle conversation vierge est bien ouverte avant tout envoi

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 4 — Transfert de contexte sans perte [TODO]
- [ ] Enchaîner `generer_reprise.ps1` + `coller_et_envoyer.ps1` vers la nouvelle fenêtre/nouveau compte
- [ ] Bascule de la bordure de contrôle et des overlays vers la nouvelle fenêtre ciblée
- [ ] Mise à jour de `etat.md` (numéro de session, compte utilisé)

**⏸ Checkpoint** — Demander à l'utilisateur de faire `/compact` avant de continuer. Attendre sa réponse écrite. Ne pas commencer la phase suivante sans confirmation.

---

## Phase 5 — Boucle de fiabilisation en conditions réelles [TODO]
- [ ] Test de bout en bout déclenché par une vraie limite atteinte (ou simulation assumée comme telle par l'utilisateur)
- [ ] Ajustement du seuil de tokens et du mapping de comptes selon les échecs constatés
- [ ] Tester d'autres formats d'échange (JSON structuré ou autre, en plus du Markdown actuel de `log_echange.ps1`) entre les deux LLM, pour comparer compréhension et économie de tokens ; garder le format le plus efficace
- [ ] Itérer jusqu'à un enchaînement fiable détection → nouvelle fenêtre → nouveau compte → calibration → reprise, sans perte de contexte
