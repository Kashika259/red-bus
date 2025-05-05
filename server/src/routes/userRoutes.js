import express from 'express';
import { check } from 'express-validator';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/users/register
router.post(
  '/register', 
  [
    //check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    //check('phone', 'Phone number is required').optional()
  ],
  registerUser
);

// @route   POST /api/users/login
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  loginUser
);

// @route   GET /api/users/profile
router.get('/profile', protect, getUserProfile);

// @route   PUT /api/users/profile
router.put('/profile', protect, updateUserProfile);

export default router;