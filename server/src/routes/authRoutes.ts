import express from 'express';
import {register, login, getMe, updateProfile} from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

//Protected Profile Routes
router.get('/me', authenticateToken, getMe);
router.patch('/profile', authenticateToken, updateProfile);


export default router;