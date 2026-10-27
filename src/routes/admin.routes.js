import { Router } from 'express';
import { sessPerm } from 'mbkauthe';
import { Permissions } from '../permissions.js';
import adminController from '../controllers/admin.controller.js';
import { createAdminDbSubRouter } from '../db/admindb.js';

const router = Router();

// Protected admin landing & dashboard
router.get('/', sessPerm(Permissions.admin.view), adminController.renderAdminDashboard);

// Protected metrics API
router.get('/metrics', sessPerm(Permissions.admin.manage), adminController.getAdminMetrics);

// Protected database administration console (/admin/db)
const adminDbRouter = createAdminDbSubRouter('/admin/db');
if (adminDbRouter) {
    router.use('/db', sessPerm(Permissions.admindb.access), adminDbRouter);
}

export default router;
