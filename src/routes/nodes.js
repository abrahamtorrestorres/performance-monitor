const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');

/**
 * @route   GET /api/v1/nodes
 * @desc    Get all nodes
 * @access  Public
 */
router.get('/', nodeController.getAllNodes);

/**
 * @route   GET /api/v1/nodes/status
 * @desc    Check status of all nodes
 * @access  Public
 */
router.get('/status', nodeController.checkAllNodesStatus);

/**
 * @route   GET /api/v1/nodes/:id
 * @desc    Get node by ID
 * @access  Public
 */
router.get('/:id', nodeController.getNodeById);

/**
 * @route   POST /api/v1/nodes
 * @desc    Create a new node
 * @access  Public
 */
router.post('/', nodeController.createNode);

/**
 * @route   PUT /api/v1/nodes/:id
 * @desc    Update a node
 * @access  Public
 */
router.put('/:id', nodeController.updateNode);

/**
 * @route   DELETE /api/v1/nodes/:id
 * @desc    Delete a node
 * @access  Public
 */
router.delete('/:id', nodeController.deleteNode);

/**
 * @route   GET /api/v1/nodes/:id/status
 * @desc    Check node status
 * @access  Public
 */
router.get('/:id/status', nodeController.checkNodeStatus);

/**
 * @route   GET /api/v1/nodes/:id/metrics
 * @desc    Get node metrics
 * @access  Public
 */
router.get('/:id/metrics', nodeController.getNodeMetrics);

module.exports = router;

