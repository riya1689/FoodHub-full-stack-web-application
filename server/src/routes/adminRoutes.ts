import express from 'express';
import { getAllUsers, getAllOrders, getAdminStats } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(authenticateToken);
// Only allow ADMINS
router.use(authorizeRole(['ADMIN']));

// GET /api/admin/stats
router.get('/stats', authenticateToken, getAdminStats);

router.get('/users', getAllUsers);
router.get('/orders', getAllOrders);

export default router;