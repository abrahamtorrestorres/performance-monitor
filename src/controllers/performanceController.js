const performanceService = require('../services/performanceService');
const logger = require('../utils/logger');

class PerformanceController {
  async submitMetrics(req, res, next) {
    try {
      const metrics = req.body;
      const result = await performanceService.saveMetrics(metrics);
      
      logger.info('Performance metrics submitted', { metricId: result.id });
      
      res.status(201).json({
        success: true,
        data: result,
        message: 'Performance metrics saved successfully'
      });
    } catch (error) {
      logger.error('Error submitting metrics:', error);
      next(error);
    }
  }

  async getMetrics(req, res, next) {
    try {
      const { startDate, endDate, type, limit = 100 } = req.query;
      const filters = { startDate, endDate, type, limit };
      
      const metrics = await performanceService.getMetrics(filters);
      
      res.json({
        success: true,
        count: metrics.length,
        data: metrics
      });
    } catch (error) {
      logger.error('Error fetching metrics:', error);
      next(error);
    }
  }

  async getMetricById(req, res, next) {
    try {
      const { id } = req.params;
      const metric = await performanceService.getMetricById(id);
      
      if (!metric) {
        return res.status(404).json({
          success: false,
          message: 'Metric not found'
        });
      }
      
      res.json({
        success: true,
        data: metric
      });
    } catch (error) {
      logger.error('Error fetching metric:', error);
      next(error);
    }
  }

  async analyzePerformance(req, res, next) {
    try {
      const metrics = req.body;
      const analysis = await performanceService.analyzePerformance(metrics);
      
      logger.info('Performance analysis completed', { 
        recommendations: analysis.recommendations.length 
      });
      
      res.json({
        success: true,
        data: analysis,
        message: 'Performance analysis completed'
      });
    } catch (error) {
      logger.error('Error analyzing performance:', error);
      next(error);
    }
  }

  async getOptimizations(req, res, next) {
    try {
      const { type } = req.query;
      const optimizations = await performanceService.getOptimizations(type);
      
      res.json({
        success: true,
        count: optimizations.length,
        data: optimizations
      });
    } catch (error) {
      logger.error('Error fetching optimizations:', error);
      next(error);
    }
  }

  async runBenchmark(req, res, next) {
    try {
      const benchmark = await performanceService.runBenchmark();
      
      logger.info('Benchmark completed', { 
        duration: benchmark.duration,
        throughput: benchmark.throughput 
      });
      
      res.json({
        success: true,
        data: benchmark,
        message: 'Benchmark completed successfully'
      });
    } catch (error) {
      logger.error('Error running benchmark:', error);
      next(error);
    }
  }
}

module.exports = new PerformanceController();

