// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');


exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await User.createUser(name, email, hashedPassword);

        res.status(201).json({ message: 'User registered', userId });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({ message: 'Login successful', user: { id: user.id, name: user.name } });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = req.user;
        res.json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

// forgot password controller
exports.forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    // Step 1: Check if user exists (case-insensitive)
    const [user] = await db.execute(
      'SELECT * FROM users WHERE LOWER(email) = LOWER(?)',
      [email]
    );
    if (!user.length) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Step 2: Generate token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expireTime = new Date(Date.now() + 3600000) // 1 hour
      .toISOString()
      .slice(0, 19)
      .replace('T', ' '); // 'YYYY-MM-DD HH:MM:SS'

    // Step 3: Store hashed token and expiry in DB
    const [result] = await db.execute(
      'UPDATE users SET resetToken = ?, resetTokenExpire = ? WHERE LOWER(email) = LOWER(?)',
      [hashedToken, expireTime, email]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'Token not saved. Update failed.' });
    }

    // Step 4: Send email with **plain token**
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `<p>Click the link below to reset your password:</p><a href="${link}">${link}</a>`;
    await sendEmail(email, 'Reset your password', html);

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// password reset controller 
exports.resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    // Hash the token received from the link
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Step 1: Find user with matching hashed token and valid expiry
    const [users] = await db.execute(
      'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpire > UTC_TIMESTAMP()',
      [hashedToken]
    );

    if (!users.length) {
      return res.status(400).json({ message: 'Token expired or invalid' });
    }

    // Step 2: Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Update password and clear reset token/expiry
    await db.execute(
      'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpire = NULL WHERE resetToken = ?',
      [hashedPassword, hashedToken]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


