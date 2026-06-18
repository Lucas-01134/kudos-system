import express from 'express';
import {
  register,
  login,
  getProfile,
  getUserById,
  getAllUsers,
  updateProfile,
  setAdminStatus
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/admin', auth, setAdminStatus);

export default router;
