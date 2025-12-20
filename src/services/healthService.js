const db = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');

class HealthService {
  async getHealthStatus() {
    const checks = {
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      memory: this.checkMemory()
    };

    const allHealthy = Object.values(checks).every(check => check.status === 'healthy');
    
    return {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      checks
    };
  }

  async checkReadiness() {
    try {
      const dbReady = await this.checkDatabase();
      const redisReady = await this.checkRedis();
      
      const ready = dbReady.status === 'healthy' && redisReady.status === 'healthy';
      
      return {
        ready,
        timestamp: new Date().toISOString(),
        services: {
          database: dbReady.status === 'healthy',
          redis: redisReady.status === 'healthy'
        }
      };
    } catch (error) {
      logger.error('Readiness check error:', error);
      return {
        ready: false,
        timestamp: new Date().toISOString(),
        error: error.message
      };
    }
  }

  checkLiveness() {
    return {
      alive: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
  }

  async checkDatabase() {
    try {
      await db.query('SELECT 1');
      return {
        status: 'healthy',
        message: 'Database connection successful'
      };
    } catch (error) {
      logger.error('Database health check failed:', error);
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message
      };
    }
  }

  async checkRedis() {
    try {
      await redis.ping();
      return {
        status: 'healthy',
        message: 'Redis connection successful'
      };
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return {
        status: 'unhealthy',
        message: 'Redis connection failed',
        error: error.message
      };
    }
  }

  checkMemory() {
    const usage = process.memoryUsage();
    const usedMB = usage.heapUsed / 1024 / 1024;
    const totalMB = usage.heapTotal / 1024 / 1024;
    const percentage = (usedMB / totalMB) * 100;

    return {
      status: percentage < 90 ? 'healthy' : 'warning',
      used: `${usedMB.toFixed(2)} MB`,
      total: `${totalMB.toFixed(2)} MB`,
      percentage: `${percentage.toFixed(2)}%`
    };
  }
}

module.exports = new HealthService();

