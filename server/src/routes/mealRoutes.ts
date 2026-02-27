import express from 'express';
import { getAllMeals, addMeal, getMealById } from '../controllers/mealController';

const router = express.Router();

// Public Routes
router.get('/', getAllMeals);
router.get('/:id', getMealById);

// Protected Routes
router.post('/', addMeal);

export default router;