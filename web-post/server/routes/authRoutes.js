const express = require('express');
const router = express.Router();
const { register, login, logout, getMe } = require('../controllers/authController');
const verifyUser = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyUser, getMe); // ✅ THIS LINE

module.exports = router;
