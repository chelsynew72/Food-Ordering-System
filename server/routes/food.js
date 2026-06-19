import { Router } from 'express';
import { body } from 'express-validator';
import { getAllFoods, getFoodById, createFood, updateFood, deleteFood } from '../controllers/foodController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllFoods);
router.get('/:id', getFoodById);

router.post(
  '/',
  protect,
  adminOnly,
  [
    body('name').trim().notEmpty().withMessage('Name required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
    body('category').notEmpty().withMessage('Category required'),
  ],
  createFood
);

router.put('/:id', protect, adminOnly, updateFood);
router.delete('/:id', protect, adminOnly, deleteFood);

export default router;
