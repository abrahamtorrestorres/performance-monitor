const express = require('express');
const router = express.Router();
const healthController = require('../controllers/healthController');

/**
 * @route   GET /api/v1/health
 * @desc    Basic health check endpoint
 * @access  Public
 */
router.get('/', healthController.healthCheck);

/**
 * @route   GET /api/v1/health/ready
 * @desc    Readiness probe for Kubernetes
 * @access  Public
 */
router.get('/ready', healthController.readinessCheck);

/**
 * @route   GET /api/v1/health/live
 * @desc    Liveness probe for Kubernetes
 * @access  Public
 */
router.get('/live', healthController.livenessCheck);

module.exports = router;

