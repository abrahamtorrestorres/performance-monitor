const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const { validatePerformanceMetrics } = require('../middleware/validation');

/**
 * @route   POST /api/v1/performance/metrics
 * @desc    Submit performance metrics for analysis
 * @access  Public
 */
router.post('/metrics', validatePerformanceMetrics, performanceController.submitMetrics);

/**
 * @route   GET /api/v1/performance/metrics
 * @desc    Get performance metrics with optional filtering
 * @access  Public
 */
router.get('/metrics', performanceController.getMetrics);

/**
 * @route   GET /api/v1/performance/metrics/:id
 * @desc    Get specific performance metric by ID
 * @access  Public
 */
router.get('/metrics/:id', performanceController.getMetricById);

/**
 * @route   POST /api/v1/performance/analyze
 * @desc    Analyze performance data and provide optimization recommendations
 * @access  Public
 */
router.post('/analyze', validatePerformanceMetrics, performanceController.analyzePerformance);

/**
 * @route   GET /api/v1/performance/optimization
 * @desc    Get optimization recommendations based on historical data
 * @access  Public
 */
router.get('/optimization', performanceController.getOptimizations);

/**
 * @route   GET /api/v1/performance/benchmark
 * @desc    Run performance benchmark tests
 * @access  Public
 */
router.get('/benchmark', performanceController.runBenchmark);

module.exports = router;

