const systemMetricsService = require('../services/systemMetricsService');
const performanceService = require('../services/performanceService');
const logger = require('../utils/logger');

class SystemController {
  async getSystemMetrics(req, res, next) {
    try {
      const metrics = systemMetricsService.getSystemMetrics();
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error getting system metrics:', error);
      next(error);
    }
  }

  async getProcessMetrics(req, res, next) {
    try {
      const metrics = systemMetricsService.getProcessMetrics();
      res.json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logger.error('Error getting process metrics:', error);
      next(error);
    }
  }

  async collectAndSave(req, res, next) {
    try {
      const systemMetrics = systemMetricsService.getSystemMetrics();
      
      // Save to database
      const savedMetric = await performanceService.saveMetrics({
        cpuUsage: systemMetrics.cpuUsage,
        memoryUsage: systemMetrics.memoryUsage,
        networkThroughput: systemMetrics.networkThroughput,
        latency: 0, // System metrics don't include latency
        metadata: {
          type: 'system',
          instance: systemMetrics.hostname,
          platform: systemMetrics.platform,
          autoCollected: true
        }
      });
      
      logger.info('System metrics collected and saved', { 
        metricId: savedMetric.id,
        cpuUsage: systemMetrics.cpuUsage,
        memoryUsage: systemMetrics.memoryUsage
      });
      
      res.json({
        success: true,
        data: {
          system: systemMetrics,
          saved: savedMetric
        },
        message: 'System metrics collected and saved successfully'
      });
    } catch (error) {
      logger.error('Error collecting system metrics:', error);
      next(error);
    }
  }
}

module.exports = new SystemController();

