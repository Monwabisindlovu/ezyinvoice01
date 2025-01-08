import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Register route
router.post('/register', async (req, res) => {
  try {
    await register(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    await login(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
