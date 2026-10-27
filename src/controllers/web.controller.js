import { renderPage, getUserContext } from 'mbkutils';
import { config } from '../config/env.js';
import { itemService } from '../services/item.service.js';

export async function renderHome(req, res) {
    try {
        const stats = await itemService.getDashboardStats().catch(() => ({
            totalItems: 0,
            systemStatus: 'healthy',
            uptime: process.uptime(),
            nodeVersion: process.version
        }));

        const recentItems = await itemService.listItems({ limit: 5 }).catch(() => []);
        const userContext = getUserContext(req);

        return renderPage(req, res, 'index.hbs', 'layout', {
            title: `${config.appName} | Home`,
            appName: config.appName,
            baseUrl: config.baseUrl,
            stats,
            recentItems,
            userContext,
            currentYear: new Date().getFullYear()
        });
    } catch (err) {
        return renderPage(req, res, 'error.hbs', 'layout', {
            title: 'Error',
            error: err.message
        });
    }
}

export async function renderDashboard(req, res) {
    try {
        const items = await itemService.listItems({ limit: 20 }).catch(() => []);
        const userContext = getUserContext(req);

        return renderPage(req, res, 'dashboard.hbs', 'layout', {
            title: `${config.appName} | Dashboard`,
            appName: config.appName,
            items,
            userContext,
            currentYear: new Date().getFullYear()
        });
    } catch (err) {
        return renderPage(req, res, 'error.hbs', 'layout', {
            title: 'Error',
            error: err.message
        });
    }
}

export default {
    renderHome,
    renderDashboard
};
