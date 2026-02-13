import express from 'express';
import { getMeals, addMeal, getMealById } from '../controllers/mealController';

const router = express.Router();

// Public Routes
router.get('/', getMeals);
router.get('/:id', getMealById);

// Protected Routes
router.post('/', addMeal);

export default router;