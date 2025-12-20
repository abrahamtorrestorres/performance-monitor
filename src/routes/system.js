const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

/**
 * @route   GET /api/v1/system/metrics
 * @desc    Get real-time system metrics
 * @access  Public
 */
router.get('/metrics', systemController.getSystemMetrics);

/**
 * @route   GET /api/v1/system/process
 * @desc    Get process-specific metrics
 * @access  Public
 */
router.get('/process', systemController.getProcessMetrics);

/**
 * @route   POST /api/v1/system/collect
 * @desc    Collect and save current system metrics
 * @access  Public
 */
router.post('/collect', systemController.collectAndSave);

module.exports = router;

