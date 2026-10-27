import { Router } from 'express';
import { sessPerm } from 'mbkauthe';
import { Permissions } from '../permissions.js';
import webController from '../controllers/web.controller.js';

const router = Router();

// Public landing page
router.get('/', webController.renderHome);

// Protected user dashboard (requires items:read permission)
router.get('/dashboard', sessPerm(Permissions.items.read), webController.renderDashboard);

export default router;
