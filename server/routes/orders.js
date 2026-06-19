import { Router } from 'express';
import { body } from 'express-validator';
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item required'),
    body('deliveryAddress').trim().notEmpty().withMessage('Delivery address required'),
  ],
  createOrder
);

router.get('/my', protect, getMyOrders);
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default router;
