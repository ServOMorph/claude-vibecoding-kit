PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  window_title_signature TEXT,
  url_signature TEXT,
  visual_signature TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS discoveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  observed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  kind TEXT NOT NULL,
  label TEXT NOT NULL,
  details TEXT NOT NULL,
  evidence_level TEXT NOT NULL CHECK (evidence_level IN ('observé', 'confirmé par source', 'à vérifier')),
  artifact_path TEXT
);

CREATE TABLE IF NOT EXISTS macros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  macro_key TEXT NOT NULL,
  label TEXT NOT NULL,
  purpose TEXT NOT NULL,
  file_path TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('brouillon', 'validée', 'désactivée')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(application_id, macro_key)
);
