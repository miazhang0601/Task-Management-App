const jwt = require('jsonwebtoken');
const { findUserById } = require('../models/user');
const secretKey = 'your_secret_key'; // Use environment variable in real applications

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = findUserById(decoded.userId);
        next();
    });
};

module.exports = authenticate;
