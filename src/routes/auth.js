const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', authController.logout);

/**
 * @route   GET /api/v1/auth/check
 * @desc    Check authentication status
 * @access  Public
 */
router.get('/check', authController.checkAuth);

module.exports = router;

