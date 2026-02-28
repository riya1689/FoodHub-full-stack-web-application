import express from 'express';
import { createReview } from '../controllers/reviewControllers';
import { authenticateToken } from '../middleware/authMiddleware'; 

const router = express.Router();

// POST /api/reviews
router.post('/', authenticateToken, createReview);

export default router;