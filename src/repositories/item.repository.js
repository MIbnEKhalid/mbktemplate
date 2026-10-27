import { BaseRepository } from 'mbkauthe';
import { defaultAdapter } from '../db/index.js';

export class ItemRepository extends BaseRepository {
  constructor(adapter = defaultAdapter) {
    super(adapter, {
      defaultTable: "template_items",
      booleanColumns: ["is_active"],
      dateColumns: ["created_at", "updated_at"],
    });
  }

  async create(data) {
    const { name, description = null, created_by = 'anonymous', status = 'active' } = data;
    const { rows } = await this.query(
      `INSERT INTO template_items (name, description, created_by, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, created_by, status, is_active, created_at, updated_at`,
      [name, description, created_by, status]
    );
    return rows[0] ? this.normalizeEntity(rows[0]) : null;
  }

  async findAll(options = {}) {
    const limit = Math.min(100, Math.max(1, parseInt(options.limit, 10) || 20));
    const { rows } = await this.query(
      `SELECT id, name, description, created_by, status, is_active, created_at, updated_at
       FROM template_items
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );
    return rows.map((r) => this.normalizeEntity(r));
  }

  async findById(id) {
    const { rows } = await this.query(
      `SELECT id, name, description, created_by, status, is_active, created_at, updated_at
       FROM template_items
       WHERE id = $1
       LIMIT 1`,
      [id]
    );
    return rows[0] ? this.normalizeEntity(rows[0]) : null;
  }

  async delete(id) {
    const { rows } = await this.query(
      `DELETE FROM template_items WHERE id = $1 RETURNING id`,
      [id]
    );
    return rows.length > 0;
  }

  async getCount() {
    const { rows } = await this.query(`SELECT COUNT(*) as count FROM template_items`);
    return parseInt(rows[0]?.count || 0, 10);
  }
}

export const itemRepository = new ItemRepository();
export default itemRepository;
