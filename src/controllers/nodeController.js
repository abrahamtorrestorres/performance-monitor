const nodeService = require('../services/nodeService');
const logger = require('../utils/logger');

class NodeController {
  async getAllNodes(req, res, next) {
    try {
      const nodes = await nodeService.getAllNodes();
      res.json({
        success: true,
        data: nodes,
        count: nodes.length
      });
    } catch (error) {
      logger.error('Error getting nodes:', error);
      next(error);
    }
  }

  async getNodeById(req, res, next) {
    try {
      const node = await nodeService.getNodeById(req.params.id);
      res.json({
        success: true,
        data: node
      });
    } catch (error) {
      logger.error('Error getting node:', error);
      next(error);
    }
  }

  async createNode(req, res, next) {
    try {
      const node = await nodeService.createNode(req.body);
      res.status(201).json({
        success: true,
        data: node,
        message: 'Node created successfully'
      });
    } catch (error) {
      logger.error('Error creating node:', error);
      next(error);
    }
  }

  async updateNode(req, res, next) {
    try {
      const node = await nodeService.updateNode(req.params.id, req.body);
      res.json({
        success: true,
        data: node,
        message: 'Node updated successfully'
      });
    } catch (error) {
      logger.error('Error updating node:', error);
      next(error);
    }
  }

  async deleteNode(req, res, next) {
    try {
      await nodeService.deleteNode(req.params.id);
      res.json({
        success: true,
        message: 'Node deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting node:', error);
      next(error);
    }
  }

  async checkNodeStatus(req, res, next) {
    try {
      const status = await nodeService.checkNodeStatus(req.params.id);
      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Error checking node status:', error);
      next(error);
    }
  }

  async getNodeMetrics(req, res, next) {
    try {
      const metrics = await nodeService.getNodeMetrics(req.params.id);
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error getting node metrics:', error);
      next(error);
    }
  }

  async checkAllNodesStatus(req, res, next) {
    try {
      const nodes = await nodeService.checkAllNodesStatus();
      res.json({
        success: true,
        data: nodes,
        count: nodes.length
      });
    } catch (error) {
      logger.error('Error checking all nodes status:', error);
      next(error);
    }
  }
}

module.exports = new NodeController();

