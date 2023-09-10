const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const userModel = require('../models/user.js');

const protect = asyncHandler(async(req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if(token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized. Invalid token');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized. No token');
    }
});

module.exports = { protect }