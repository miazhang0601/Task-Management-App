const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createUser, findUserByUsername } = require('../models/user');
const logger = require('../utils/logger');

const router = express.Router();
const secretKey = 'your_secret_key'; // Use environment variable in real applications

router.post('/register', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (findUserByUsername(username)) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await createUser(username, password);
        logger.info(`User registered: ${username}`);
        res.status(201).json({ message: 'User created', userId: user.id });
    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = findUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
        logger.info(`User logged in: ${username}`);
        res.json({ token });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
