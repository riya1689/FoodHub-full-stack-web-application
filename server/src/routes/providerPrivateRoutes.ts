import express from 'express';
import { getDashboardStats, getProviderOrders, updateOrderStatus, addMeal, deleteMeal } from '../controllers/providerController';
import { authenticateToken } from '../middleware/authMiddleware'; 

const router = express.Router();

// GET /api/provider/stats
router.get('/stats', authenticateToken, getDashboardStats);

// GET /api/provider/orders
router.get('/orders', authenticateToken, getProviderOrders);

// PATCH /api/provider/orders/:id
router.patch('/orders/:id', authenticateToken, updateOrderStatus);
//menu management route
router.post('/meals', authenticateToken, addMeal);
router.delete('/meals/:id', authenticateToken, deleteMeal);

export default router;