import { itemRepository } from '../repositories/index.js';

export class ItemService {
  async listItems(options = {}) {
    return itemRepository.findAll(options);
  }

  async getItem(id) {
    if (!id) throw new Error('Item ID is required');
    const item = await itemRepository.findById(id);
    if (!item) {
      const err = new Error('Item not found');
      err.statusCode = 404;
      err.code = 'ITEM_NOT_FOUND';
      throw err;
    }
    return item;
  }

  async createItem(data, user = null) {
    const name = (data.name || '').trim();
    if (!name) {
      const err = new Error('Item name is required and cannot be empty');
      err.statusCode = 400;
      err.code = 'VALIDATION_ERROR';
      throw err;
    }

    const created_by = user?.username || data.created_by || 'anonymous';
    return itemRepository.create({
      name,
      description: data.description ? data.description.trim() : null,
      status: data.status || 'active',
      created_by
    });
  }

  async deleteItem(id) {
    if (!id) throw new Error('Item ID is required');
    const deleted = await itemRepository.delete(id);
    if (!deleted) {
      const err = new Error('Item not found or already deleted');
      err.statusCode = 404;
      err.code = 'ITEM_NOT_FOUND';
      throw err;
    }
    return { id, deleted: true };
  }

  async getDashboardStats() {
    const count = await itemRepository.getCount();
    return {
      totalItems: count,
      systemStatus: 'healthy',
      uptime: process.uptime(),
      nodeVersion: process.version
    };
  }
}

export const itemService = new ItemService();
export default itemService;
