import { renderPage, getUserContext, sendSuccess, sendError } from 'mbkutils';
import { config } from '../config/env.js';
import { itemService } from '../services/item.service.js';

export async function renderAdminDashboard(req, res) {
    try {
        const stats = await itemService.getDashboardStats();
        const items = await itemService.listItems({ limit: 50 });
        const userContext = getUserContext(req);

        return renderPage(req, res, 'admin.hbs', 'layout', {
            title: `${config.appName} | Admin Panel`,
            appName: config.appName,
            isAdmin: true,
            stats,
            items,
            userContext,
            currentYear: new Date().getFullYear()
        });
    } catch (err) {
        return renderPage(req, res, 'error.hbs', 'layout', {
            title: 'Admin Error',
            error: err.message
        });
    }
}

export async function getAdminMetrics(req, res) {
    try {
        const stats = await itemService.getDashboardStats();
        return sendSuccess(res, stats, { req });
    } catch (err) {
        return sendError(res, err, { req, statusCode: 500 });
    }
}

export default {
    renderAdminDashboard,
    getAdminMetrics
};
