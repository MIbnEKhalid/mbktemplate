import { sendSuccess, sendError } from 'mbkutils';
import { itemService } from '../services/item.service.js';
import { testDbConnection } from '../db/connection.js';

export async function getHealth(req, res) {
    try {
        const dbOk = await testDbConnection();
        const data = {
            status: dbOk ? 'ok' : 'degraded',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: dbOk ? 'connected' : 'unreachable',
            version: process.env.npm_package_version || '1.0.0',
            node: process.version
        };
        return sendSuccess(res, data, { req, message: 'Service healthy' });
    } catch (err) {
        return sendError(res, err, { req, statusCode: 500 });
    }
}

export async function getItems(req, res) {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 20;
        const items = await itemService.listItems({ limit });
        return sendSuccess(res, { items, count: items.length }, { req });
    } catch (err) {
        return sendError(res, err, { req, statusCode: 500 });
    }
}

export async function getItem(req, res) {
    try {
        const item = await itemService.getItem(req.params.id);
        return sendSuccess(res, { item }, { req });
    } catch (err) {
        const status = err.statusCode || 500;
        return sendError(res, err, { req, statusCode: status });
    }
}

export async function createItem(req, res) {
    try {
        const user = req.session?.user || req.user || null;
        const newItem = await itemService.createItem(req.body, user);
        return sendSuccess(res, { item: newItem }, { req, statusCode: 201, message: 'Item created successfully' });
    } catch (err) {
        const status = err.statusCode || 400;
        return sendError(res, err, { req, statusCode: status });
    }
}

export async function deleteItem(req, res) {
    try {
        const result = await itemService.deleteItem(req.params.id);
        return sendSuccess(res, result, { req, message: 'Item deleted successfully' });
    } catch (err) {
        const status = err.statusCode || 500;
        return sendError(res, err, { req, statusCode: status });
    }
}

export default {
    getHealth,
    getItems,
    getItem,
    createItem,
    deleteItem
};
