import { Router } from 'express';
import { sessPerm } from 'mbkauthe';
import { Permissions } from '../permissions.js';
import { apiCreationLimiter } from '../middleware/rate-limiter.js';
import apiController from '../controllers/api.controller.js';

const router = Router();

// Public health check endpoint
router.get('/health', apiController.getHealth);

// Item endpoints
router.get('/items', apiController.getItems);
router.get('/items/:id', apiController.getItem);

// Protected mutation endpoints
router.post('/items', sessPerm(Permissions.items.create), apiCreationLimiter, apiController.createItem);
router.delete('/items/:id', sessPerm(Permissions.items.delete), apiController.deleteItem);

export default router;
