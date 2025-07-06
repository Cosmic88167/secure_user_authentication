const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to verify role (example for admin route)
const verifyRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ error: 'Access forbidden' });
    next();
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'lax'
        });
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Protected Route
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Protected content accessed', user: req.user });
});

// Admin Route (example)
router.get('/admin', verifyToken, verifyRole('admin'), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;