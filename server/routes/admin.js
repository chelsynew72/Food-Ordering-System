import { Router } from 'express';
import { getAllCustomers, getDashboardStats } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/customers', protect, adminOnly, getAllCustomers);
router.get('/stats', protect, adminOnly, getDashboardStats);

export default router;
