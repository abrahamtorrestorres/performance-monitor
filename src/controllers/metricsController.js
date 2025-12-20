const metricsService = require('../services/metricsService');

class MetricsController {
  async getMetrics(req, res) {
    try {
      const prometheusMetrics = await metricsService.getPrometheusMetrics();
      res.set('Content-Type', 'text/plain; version=0.0.4');
      res.send(prometheusMetrics);
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve metrics',
        message: error.message
      });
    }
  }
}

module.exports = new MetricsController();

