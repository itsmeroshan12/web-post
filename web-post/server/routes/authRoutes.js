const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  forgotPasswordController,
  resetPasswordController
} = require('../controllers/authController');

const verifyUser = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password', resetPasswordController);

// Protected route
router.get('/me', verifyUser, getMe);

module.exports = router;
