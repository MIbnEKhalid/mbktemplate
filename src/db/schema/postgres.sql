-- PostgreSQL Schema for MBKTemplate
CREATE TABLE IF NOT EXISTS template_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_template_items_status ON template_items(status);
CREATE INDEX IF NOT EXISTS idx_template_items_created_at ON template_items(created_at DESC);
