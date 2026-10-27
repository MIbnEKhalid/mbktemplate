import { Router } from 'express';
import { sessPerm } from 'mbkauthe';
import { Permissions } from '../permissions.js';
import adminController from '../controllers/admin.controller.js';

const router = Router();

// Protected admin landing & dashboard
router.get('/', sessPerm(Permissions.admin.view), adminController.renderAdminDashboard);

// Protected metrics API
router.get('/metrics', sessPerm(Permissions.admin.manage), adminController.getAdminMetrics);

export default router;
