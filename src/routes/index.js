import { Router } from 'express';
import mbkroutes from 'mbkauthe';
import adminRoutes from './admin.routes.js';
import apiRoutes from './api.routes.js';
import webRoutes from './web.routes.js';

const router = Router();

// Mount mbkauthe authentication routes (/login, /register, /logout, 2FA, OAuth, etc.)
router.use(mbkroutes);

// Mount application sub-routers
router.use('/admin', adminRoutes);
router.use('/api', apiRoutes);
router.use('/', webRoutes);

export default router;
