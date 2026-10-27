-- SQLite Schema for MBKTemplate
CREATE TABLE IF NOT EXISTS template_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_by TEXT,
    status TEXT DEFAULT 'active',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_template_items_status ON template_items(status);
CREATE INDEX IF NOT EXISTS idx_template_items_created_at ON template_items(created_at DESC);
