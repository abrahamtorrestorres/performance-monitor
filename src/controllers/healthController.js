const healthService = require('../services/healthService');
const logger = require('../utils/logger');

class HealthController {
  async healthCheck(req, res) {
    try {
      const health = await healthService.getHealthStatus();
      const statusCode = health.status === 'healthy' ? 200 : 503;
      
      res.status(statusCode).json(health);
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }

  async readinessCheck(req, res) {
    try {
      const ready = await healthService.checkReadiness();
      const statusCode = ready.ready ? 200 : 503;
      
      res.status(statusCode).json(ready);
    } catch (error) {
      logger.error('Readiness check failed:', error);
      res.status(503).json({
        ready: false,
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }

  async livenessCheck(req, res) {
    try {
      const alive = healthService.checkLiveness();
      res.status(200).json(alive);
    } catch (error) {
      logger.error('Liveness check failed:', error);
      res.status(503).json({
        alive: false,
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  }
}

module.exports = new HealthController();

