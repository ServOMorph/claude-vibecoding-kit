#!/usr/bin/env python3
"""
check_kit.py — Contrôle d'intégrité mécanique du claude-vibecoding-kit.

Contrôles implémentés (Phase 3 de roadmap_refacto_kit.md) :
1. Paires miroir .claude/ <-> templates/.claude/ identiques (hors bloc SPECIFICITES PROJET et placeholders {{...}})
2. Aucun fichier versionné en CRLF
3. Commandes listées dans README.md § "Ce que ça fait" = fichiers réels de .claude/commands/ et templates/.claude/commands/
4. Version en tête de CHANGELOG.md = version dans README.md § "État actuel" = dernière entrée de Protocole_start_close_context.md
5. _contexte/signals.md sous seuil (nombre de blocs # Session du)
6. Tout fichier cité par un chemin relatif dans .claude/commands/*.md existe

Sortie : une ligne par écart, exit code 1 si au moins un écart.
Aucun correctif automatique.
"""

import os
import re
import sys
from pathlib import Path


# Constantes
KIT_ROOT = Path(__file__).parent.parent.resolve()
CLAUDE_DIR = KIT_ROOT / ".claude"
TEMPLATES_DIR = KIT_ROOT / "templates" / ".claude"
CONTEXTE_DIR = KIT_ROOT / "_contexte"
README_PATH = KIT_ROOT / "README.md"
CHANGELOG_PATH = KIT_ROOT / "CHANGELOG.md"
PROTOCOLE_PATH = KIT_ROOT / "Protocole_start_close_context.md"
SIGNALS_PATH = CONTEXTE_DIR / "signals.md"

# Seuil pour signals.md (Phase 4 : conserver seulement la dernière session)
SIGNALS_SESSION_THRESHOLD = 1

# Paires miroir à vérifier (fichiers qui doivent être identiques hors bloc SPECIFICITES PROJET et placeholders)
MIRROR_PAIRS = [
    ("commands/start.md", "commands/start.md"),
    ("commands/close.md", "commands/close.md"),
    ("commands/create_memory.md", "commands/create_memory.md"),
    ("commands/init_projet.md", "commands/init_projet.md"),
    ("commands/update.md", "commands/update.md"),
    ("CLAUDE.md", "CLAUDE.md"),
]

# Commandes kit-only (absentes de templates/)
KIT_ONLY_COMMANDS = {"cherche_meilleure_action.md", "create_agent.md", "create_com_agents.md", "doc_sync.md"}


def get_version_from_changelog():
    """Extrait la version en tête de CHANGELOG.md (ex: v3.18)."""
    if not CHANGELOG_PATH.exists():
        return None
    with open(CHANGELOG_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r"^##\s*(v\d+\.\d+)", content, re.MULTILINE)
    return match.group(1) if match else None


def get_version_from_readme():
    """Extrait la version mentionnée dans README.md § État actuel."""
    if not README_PATH.exists():
        return None
    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    # Chercher dans la section État actuel
    match = re.search(r"## État actuel\s*\n\n.*?(Kit v\d+\.\d+)", content, re.DOTALL)
    if match:
        return match.group(1).replace("Kit ", "")
    return None


def get_version_from_protocole():
    """Extrait la dernière version du changelog de Protocole_start_close_context.md."""
    if not PROTOCOLE_PATH.exists():
        return None
    with open(PROTOCOLE_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    # Chercher la dernière entrée de changelog (format: > **vX.Y** — ...)
    matches = re.findall(r">\s*\*\*(v\d+\.\d+)\*\*", content)
    return matches[-1] if matches else None


def check_version_consistency():
    """Contrôle 4 : version en tête de CHANGELOG.md = README.md = Protocole_start_close_context.md."""
    errors = []
    changelog_ver = get_version_from_changelog()
    readme_ver = get_version_from_readme()
    protocole_ver = get_version_from_protocole()
    
    versions = {
        "CHANGELOG.md": changelog_ver,
        "README.md": readme_ver,
        "Protocole_start_close_context.md": protocole_ver,
    }
    
    # Trouver toutes les versions distinctes
    unique_versions = set(v for v in versions.values() if v is not None)
    if len(unique_versions) > 1:
        for path, ver in versions.items():
            if ver:
                errors.append(f"Version incohérente : {path} annonce {ver}, mais d'autres fichiers annoncent {', '.join(sorted(unique_versions - {ver}))}")
    elif len(unique_versions) == 1:
        # Toutes les versions sont cohérentes
        pass
    else:
        errors.append("Aucune version trouvée dans CHANGELOG.md, README.md ou Protocole_start_close_context.md")
    
    return errors


def remove_specificites_projet(content):
    """Supprime le bloc SPECIFICITES PROJET d'un contenu markdown."""
    # Pattern pour capturer le bloc entre les marqueurs
    pattern = r"<!-- SPECIFICITES PROJET : DEBUT.*?-->.*?<!-- SPECIFICITES PROJET : FIN -->"
    return re.sub(pattern, "", content, flags=re.DOTALL)


def remove_placeholders(content):
    """Supprime les lignes contenant des placeholders {{...}}."""
    lines = content.split("\n")
    filtered_lines = [line for line in lines if "{{" not in line or "}}" not in line]
    return "\n".join(filtered_lines)


def normalize_content(content):
    """Normalise le contenu pour comparaison : supprime bloc SPECIFICITES PROJET et placeholders."""
    content = remove_specificites_projet(content)
    content = remove_placeholders(content)
    # Normaliser les fins de ligne
    return content.replace("\r\n", "\n").replace("\r", "\n")


def check_mirror_pairs():
    """Contrôle 1 : paires miroir .claude/ <-> templates/.claude/ identiques."""
    errors = []
    
    for kit_rel_path, template_rel_path in MIRROR_PAIRS:
        kit_path = CLAUDE_DIR / kit_rel_path
        template_path = TEMPLATES_DIR / template_rel_path
        
        # Vérifier l'existence
        if not kit_path.exists():
            errors.append(f"Fichier manquant : .claude/{kit_rel_path} n'existe pas")
            continue
        if not template_path.exists():
            errors.append(f"Fichier manquant : templates/.claude/{template_rel_path} n'existe pas")
            continue
        
        # Lire et normaliser les contenus
        with open(kit_path, "r", encoding="utf-8") as f:
            kit_content = f.read()
        with open(template_path, "r", encoding="utf-8") as f:
            template_content = f.read()
        
        kit_normalized = normalize_content(kit_content)
        template_normalized = normalize_content(template_content)
        
        if kit_normalized != template_normalized:
            # Compter les différences pour donner une idée
            kit_lines = kit_normalized.split("\n")
            template_lines = template_normalized.split("\n")
            diff_count = len(kit_lines) + len(template_lines) - 2 * len(set(kit_lines) & set(template_lines))
            errors.append(f"Divergence : .claude/{kit_rel_path} != templates/.claude/{template_rel_path} ({diff_count} lignes différentes après normalisation)")
    
    return errors


def check_crlf_files():
    """Contrôle 2 : aucun fichier versionné en CRLF."""
    errors = []
    
    # Dossiers à ignorer (gitignore standard + dossiers de build/test)
    ignored_dirs = {".git", "__pycache__", ".pytest_cache", ".vscode", ".idea", "build", "dist", "venv", ".venv"}
    # Extensions de fichiers à ignorer
    ignored_extensions = {".pyc", ".swp", ".swo", ".DS_Store", ".log", ".bak", ".tmp"}
    # Extensions binaires à ignorer
    binary_extensions = {".png", ".jpg", ".jpeg", ".gif", ".bin", ".exe", ".dll", ".so", ".pyd", ".pyo"}
    
    for root, dirs, files in os.walk(KIT_ROOT):
        # Filtrer les dossiers ignorés
        dirs[:] = [d for d in dirs if d not in ignored_dirs]
        
        for file in files:
            filepath = Path(root) / file
            
            # Ignorer par extension
            if filepath.suffix.lower() in ignored_extensions or filepath.suffix.lower() in binary_extensions:
                continue
            
            try:
                with open(filepath, "rb") as f:
                    content = f.read()
                
                # Vérifier la présence de CRLF
                if b"\r\n" in content:
                    # Vérifier que ce n'est pas un fichier binaire
                    try:
                        content.decode("utf-8")
                        errors.append(f"Fichier CRLF : {filepath.relative_to(KIT_ROOT)}")
                    except UnicodeDecodeError:
                        # Fichier binaire, ignorer
                        pass
            except (PermissionError, OSError):
                pass
    
    return errors


def check_commands_in_readme():
    """Contrôle 3 : commandes listées dans README.md § "Ce que ça fait" = fichiers réels."""
    errors = []
    
    if not README_PATH.exists():
        errors.append("README.md introuvable")
        return errors
    
    with open(README_PATH, "r", encoding="utf-8") as f:
        readme_content = f.read()
    
    # Extraire la section "Ce que ça fait"
    match = re.search(r"## Ce que ça fait\s*\n\n(.*?)(?=\n## |\Z)", readme_content, re.DOTALL)
    if not match:
        errors.append("Section 'Ce que ça fait' introuvable dans README.md")
        return errors
    
    section_content = match.group(1)
    
    # Extraire les lignes de commande (format: - `/command` — description)
    # Capturer le nom de la commande entre / et le backtick final ou espace/crochet
    command_pattern = r"^- `/([^\s\[\()]+?)(?=\s|\]|\(|`|$)"
    readme_commands = set(re.findall(command_pattern, section_content, re.MULTILINE))
    
    # Lister les fichiers réels dans .claude/commands/
    kit_commands = set()
    if CLAUDE_DIR.exists():
        for f in (CLAUDE_DIR / "commands").iterdir():
            if f.is_file() and f.suffix == ".md":
                kit_commands.add(f.stem)
    
    # Lister les fichiers réels dans templates/.claude/commands/
    template_commands = set()
    if TEMPLATES_DIR.exists():
        for f in (TEMPLATES_DIR / "commands").iterdir():
            if f.is_file() and f.suffix == ".md":
                template_commands.add(f.stem)
    
    # Vérifier que chaque commande listée dans README existe
    for cmd in readme_commands:
        # Les commandes kit-only sont marquées dans README
        if cmd in KIT_ONLY_COMMANDS:
            if cmd not in kit_commands:
                errors.append(f"Commande kit-only listée dans README.md mais absente de .claude/commands/ : {cmd}")
        else:
            if cmd not in kit_commands and cmd not in template_commands:
                errors.append(f"Commande listée dans README.md mais absente de .claude/commands/ et templates/.claude/commands/ : {cmd}")
    
    # Vérifier que chaque fichier réel est listé dans README (sauf kit-only)
    all_listed_commands = readme_commands.copy()
    for cmd in kit_commands | template_commands:
        if cmd not in all_listed_commands and cmd not in KIT_ONLY_COMMANDS:
            errors.append(f"Commande présente dans .claude/commands/ ou templates/ mais non listée dans README.md : {cmd}")
    
    return errors


def check_signals_threshold():
    """Contrôle 5 : _contexte/signals.md sous le seuil de blocs # Session du."""
    errors = []
    
    if not SIGNALS_PATH.exists():
        errors.append("_contexte/signals.md introuvable")
        return errors
    
    with open(SIGNALS_PATH, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Compter les blocs "# Session du"
    session_blocks = re.findall(r"^# Session du \d{4}-\d{2}-\d{2}", content, re.MULTILINE)
    session_count = len(session_blocks)
    
    if session_count > SIGNALS_SESSION_THRESHOLD:
        errors.append(f"signals.md contient {session_count} blocs 'Session du' (seuil max: {SIGNALS_SESSION_THRESHOLD})")
    
    return errors


def extract_relative_paths_from_markdown(content, base_dir):
    """Extrait tous les chemins relatifs cités dans un contenu markdown.
    
    Ignore :
    - Les chemins contenant des placeholders ({...}, <...>, $VAR)
    - Les URLs
    - Les chemins absolus
    - Les chemins entre backticks qui sont des commandes (ex: `/start`)
    - Les chemins qui sont clairement des exemples génériques (ex: path/to/file)
    """
    paths = set()
    
    # Pattern pour les chemins entre backticks : `path/to/file.ext`
    # Exclure les commandes (commencant par /) et les placeholders
    backtick_pattern = r"`([^`\n]+?\.(?:md|py|txt|json|yaml|yml|sh|ps1|bat))`"
    matches = re.findall(backtick_pattern, content)
    for path in matches:
        # Nettoyer
        path = path.strip(".,;:!?()[]{}'")
        # Ignorer si contient des placeholders ou variables
        if any(c in path for c in ['{', '}', '<', '>', '$']):
            continue
        # Ignorer les commandes (commencant par /)
        if path.startswith("/"):
            continue
        # Ignorer les chemins absolus Windows
        if re.match(r"^[a-zA-Z]:\\", path):
            continue
        # Ignorer les URLs
        if path.startswith(("http://", "https://", "ftp://", "file://")):
            continue
        # Accepter les chemins relatifs avec des sous-dossiers
        if "/" in path or "\\" in path:
            paths.add(path.replace("\\", "/"))
    
    return paths


def check_referenced_files_exist():
    """Contrôle 6 : tout fichier cité par un chemin relatif dans .claude/commands/*.md existe.
    
    Ignore les fichiers qui sont des outputs de commandes (créés dans les projets cibles) :
    - zones.md, statut.md, messages.md, memory.md, agent_role.md
    - DOCUMENTATION/INDEX.md, base_connaissances/ (fichiers de connaissance)
    - DEPLOYMENTS.md, AGENTS_REGISTRY.md (fichiers de bookkeeping du kit)
    """
    errors = []
    commands_dir = CLAUDE_DIR / "commands"
    
    if not commands_dir.exists():
        errors.append(".claude/commands/ introuvable")
        return errors
    
    # Fichiers qui sont des outputs de commandes (non présents dans le kit, créés dans les projets cibles)
    OUTPUT_FILES = {
        "zones.md",
        "statut.md",
        "messages.md",
        "memory.md",
        "agent_role.md",
        "DOCUMENTATION/INDEX.md",
        "DEPLOYMENTS.md",
        "AGENTS_REGISTRY.md",
    }
    
    for cmd_file in commands_dir.glob("*.md"):
        with open(cmd_file, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Extraire les chemins relatifs
        relative_paths = extract_relative_paths_from_markdown(content, KIT_ROOT)
        
        for rel_path in relative_paths:
            # Ignorer les fichiers qui sont des outputs connus
            if any(rel_path.endswith(output_file) for output_file in OUTPUT_FILES):
                continue
            
            # Remplacer les préfixes courts par les vrais chemins
            # "claude/" -> ".claude/"
            # "commands/" -> ".claude/commands/"
            normalized_path = rel_path
            if normalized_path.startswith("claude/"):
                normalized_path = "." + normalized_path
            elif normalized_path.startswith("commands/"):
                normalized_path = ".claude/" + normalized_path
            
            # Construire le chemin absolu à partir de la racine du kit
            full_path = KIT_ROOT / normalized_path
            
            if not full_path.exists():
                errors.append(f"Fichier référencé introuvable : {rel_path} (cité dans .claude/commands/{cmd_file.name})")
    
    return errors


def main():
    """Exécute tous les contrôles et affiche les écarts."""
    all_errors = []
    
    # Contrôle 1 : Paires miroir
    all_errors.extend(check_mirror_pairs())
    
    # Contrôle 2 : CRLF
    all_errors.extend(check_crlf_files())
    
    # Contrôle 3 : Commandes dans README
    all_errors.extend(check_commands_in_readme())
    
    # Contrôle 4 : Cohérence des versions
    all_errors.extend(check_version_consistency())
    
    # Contrôle 5 : Seuil signals.md
    all_errors.extend(check_signals_threshold())
    
    # Contrôle 6 : Fichiers référencés
    all_errors.extend(check_referenced_files_exist())
    
    # Afficher les résultats
    if all_errors:
        print("ECARTS DETECTES :")
        for error in all_errors:
            print(f"  - {error}")
        sys.exit(1)
    else:
        print("Tous les contrôles sont passants.")
        sys.exit(0)


if __name__ == "__main__":
    main()
