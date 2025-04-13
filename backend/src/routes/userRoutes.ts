
import express from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/login/otp', userController.loginWithOtp);
router.post('/send-otp', userController.sendOtp);

// Protected routes
router.get('/profile', authenticateJWT, userController.getProfile);
router.put('/profile', authenticateJWT, userController.updateProfile);
router.post('/upgrade', authenticateJWT, userController.upgradeToPermium);
router.post('/downgrade', authenticateJWT, userController.downgradeToFree);

// Admin routes
router.get('/', authenticateJWT, userController.getAllUsers);

export { router as userRoutes };
