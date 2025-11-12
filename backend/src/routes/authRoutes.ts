import express from 'express';
import authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser.bind(authController));

export default router;