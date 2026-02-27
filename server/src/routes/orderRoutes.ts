import express from 'express';
import { createOrder, getMyOrders, getOrderById } from '../controllers/orderController';
import { authenticateToken } from '../middleware/authMiddleware';; 

const router = express.Router();

// POST /api/orders (Create an order)
router.post('/', authenticateToken, createOrder);

// GET /api/orders (Get my orders)
router.get('/', authenticateToken, getMyOrders);
//Route to get a specific order by ID
router.get('/:id', authenticateToken, getOrderById);

export default router;