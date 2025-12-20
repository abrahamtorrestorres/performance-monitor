const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

/**
 * @route   GET /api/v1/metrics
 * @desc    Get Prometheus-compatible metrics
 * @access  Public
 */
router.get('/', metricsController.getMetrics);

module.exports = router;

