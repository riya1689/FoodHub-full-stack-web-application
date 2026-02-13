import express from 'express';
import { getProviderOrders, updateOrderStatus } from '../controllers/providerController';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.use(authenticateToken);
// Only allow Providers and Admin
router.use(authorizeRole(['PROVIDER', 'ADMIN']));

router.get('/orders', getProviderOrders);
router.patch('/orders/:id', updateOrderStatus);

export default router;