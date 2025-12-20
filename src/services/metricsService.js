const client = require('prom-client');
const logger = require('../utils/logger');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const performanceMetricsGauge = new client.Gauge({
  name: 'performance_metrics_total',
  help: 'Total number of performance metrics collected',
  labelNames: ['type']
});

const activeConnections = new client.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

// Register custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(performanceMetricsGauge);
register.registerMetric(activeConnections);

class MetricsService {
  async getPrometheusMetrics() {
    try {
      return await register.metrics();
    } catch (error) {
      logger.error('Error generating Prometheus metrics:', error);
      throw error;
    }
  }

  recordHttpRequest(method, route, statusCode, duration) {
    httpRequestDuration.observe({ method, route, status_code: statusCode }, duration / 1000);
    httpRequestTotal.inc({ method, route, status_code: statusCode });
  }

  incrementPerformanceMetrics(type) {
    performanceMetricsGauge.inc({ type });
  }

  setActiveConnections(count) {
    activeConnections.set(count);
  }
}

module.exports = new MetricsService();

