const db = require('../config/database');
const redis = require('../config/redis');
const logger = require('../utils/logger');
const { v4: uuidv4 } = require('uuid');

class PerformanceService {
  async saveMetrics(metrics) {
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    
    const metricData = {
      id,
      ...metrics,
      timestamp,
      createdAt: timestamp
    };

    // Save to database
    const query = `
      INSERT INTO performance_metrics (id, cpu_usage, memory_usage, network_throughput, 
        latency, timestamp, metadata)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      id,
      metrics.cpuUsage || 0,
      metrics.memoryUsage || 0,
      metrics.networkThroughput || 0,
      metrics.latency || 0,
      timestamp,
      JSON.stringify(metrics.metadata || {})
    ];

    try {
      const result = await db.query(query, values);
      
      // Cache in Redis for quick access
      await redis.setex(`metric:${id}`, 3600, JSON.stringify(metricData));
      
      return result.rows[0];
    } catch (error) {
      logger.error('Error saving metrics:', error);
      throw error;
    }
  }

  async getMetrics(filters = {}) {
    let query = 'SELECT * FROM performance_metrics WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.startDate) {
      query += ` AND timestamp >= $${paramCount}`;
      values.push(filters.startDate);
      paramCount++;
    }

    if (filters.endDate) {
      query += ` AND timestamp <= $${paramCount}`;
      values.push(filters.endDate);
      paramCount++;
    }

    if (filters.type) {
      query += ` AND metadata->>'type' = $${paramCount}`;
      values.push(filters.type);
      paramCount++;
    }

    query += ' ORDER BY timestamp DESC';
    query += ` LIMIT $${paramCount}`;
    values.push(parseInt(filters.limit) || 100);

    try {
      const result = await db.query(query, values);
      return result.rows || [];
    } catch (error) {
      logger.error('Error fetching metrics:', error);
      // Return empty array instead of throwing to prevent API crashes
      return [];
    }
  }

  async getMetricById(id) {
    // Try Redis cache first
    try {
      const cached = await redis.get(`metric:${id}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      logger.warn('Redis cache miss:', error);
    }

    // Fallback to database
    const query = 'SELECT * FROM performance_metrics WHERE id = $1';
    const result = await db.query(query, [id]);
    
    if (result.rows.length > 0) {
      return result.rows[0];
    }
    
    return null;
  }

  async analyzePerformance(metrics) {
    const analysis = {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      recommendations: [],
      score: 0
    };

    // CPU analysis
    if (metrics.cpuUsage > 80) {
      analysis.recommendations.push({
        type: 'cpu',
        severity: 'high',
        message: 'High CPU usage detected. Consider scaling horizontally or optimizing workloads.',
        suggestion: 'Review CPU-intensive processes and consider load balancing'
      });
    } else if (metrics.cpuUsage < 20) {
      analysis.recommendations.push({
        type: 'cpu',
        severity: 'low',
        message: 'Low CPU utilization. Consider right-sizing resources for cost optimization.',
        suggestion: 'Evaluate if smaller instance types would be sufficient'
      });
    }

    // Memory analysis
    if (metrics.memoryUsage > 85) {
      analysis.recommendations.push({
        type: 'memory',
        severity: 'high',
        message: 'High memory usage detected. Monitor for potential memory leaks.',
        suggestion: 'Review memory allocation patterns and consider increasing memory limits'
      });
    }

    // Latency analysis
    if (metrics.latency > 100) {
      analysis.recommendations.push({
        type: 'latency',
        severity: 'high',
        message: 'High latency detected. Investigate network or processing bottlenecks.',
        suggestion: 'Review network configuration and database query performance'
      });
    }

    // Calculate performance score (0-100)
    analysis.score = this.calculatePerformanceScore(metrics);

    return analysis;
  }

  calculatePerformanceScore(metrics) {
    let score = 100;
    
    // Deduct points for high usage
    if (metrics.cpuUsage > 80) score -= 20;
    else if (metrics.cpuUsage > 60) score -= 10;
    
    if (metrics.memoryUsage > 85) score -= 20;
    else if (metrics.memoryUsage > 70) score -= 10;
    
    if (metrics.latency > 100) score -= 30;
    else if (metrics.latency > 50) score -= 15;
    
    return Math.max(0, Math.min(100, score));
  }

  async getOptimizations(type = null) {
    const optimizations = [
      {
        id: 'opt-1',
        type: 'cpu',
        title: 'Enable CPU Burst Performance Mode',
        description: 'Configure Intel Turbo Boost for burst workloads',
        impact: 'high',
        effort: 'medium'
      },
      {
        id: 'opt-2',
        type: 'memory',
        title: 'Optimize Memory Allocation',
        description: 'Use Intel Memory Protection Extensions (MPX) for better memory management',
        impact: 'medium',
        effort: 'low'
      },
      {
        id: 'opt-3',
        type: 'network',
        title: 'Enable DPDK for Network Acceleration',
        description: 'Leverage Intel Data Plane Development Kit for high-performance networking',
        impact: 'high',
        effort: 'high'
      },
      {
        id: 'opt-4',
        type: 'compute',
        title: 'Utilize Intel AVX-512 Instructions',
        description: 'Enable Advanced Vector Extensions for parallel processing workloads',
        impact: 'high',
        effort: 'medium'
      }
    ];

    if (type) {
      return optimizations.filter(opt => opt.type === type);
    }

    return optimizations;
  }

  async runBenchmark() {
    const systemMetricsService = require('./systemMetricsService');
    
    // Get initial system state
    const initialMetrics = systemMetricsService.getSystemMetrics();
    const initialCpuUsage = process.cpuUsage();
    const initialMemory = process.memoryUsage();
    const startTime = Date.now();
    
    // Real CPU-intensive operations
    const operations = [];
    const iterations = 100000; // More realistic workload
    
    // CPU benchmark: Matrix multiplication simulation
    for (let i = 0; i < iterations; i++) {
      const a = Math.random() * 100;
      const b = Math.random() * 100;
      operations.push(Math.sqrt(a * a + b * b));
      operations.push(Math.sin(a) * Math.cos(b));
    }
    
    // Memory benchmark: Array operations
    const memoryTest = [];
    for (let i = 0; i < 10000; i++) {
      memoryTest.push(new Array(100).fill(Math.random()));
    }
    
    // Network latency simulation (API call to self)
    const latencyStart = Date.now();
    // Simulate network operation
    await new Promise(resolve => setTimeout(resolve, 0));
    const latency = Date.now() - latencyStart;
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Get final system state
    const finalMetrics = systemMetricsService.getSystemMetrics();
    const finalCpuUsage = process.cpuUsage();
    const finalMemory = process.memoryUsage();
    
    // Calculate actual CPU usage during benchmark
    const cpuDelta = {
      user: (finalCpuUsage.user - initialCpuUsage.user) / 1000000, // Convert to seconds
      system: (finalCpuUsage.system - initialCpuUsage.system) / 1000000
    };
    
    // Calculate memory delta
    const memoryDelta = {
      rss: finalMemory.rss - initialMemory.rss,
      heapTotal: finalMemory.heapTotal - initialMemory.heapTotal,
      heapUsed: finalMemory.heapUsed - initialMemory.heapUsed
    };
    
    // Calculate system CPU usage change
    const systemCpuDelta = finalMetrics.cpuUsage - initialMetrics.cpuUsage;
    const systemMemoryDelta = finalMetrics.memoryUsage - initialMetrics.memoryUsage;
    
    return {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      throughput: `${(iterations / (duration / 1000)).toFixed(2)} ops/sec`,
      operations: iterations,
      metrics: {
        cpuUsage: {
          process: {
            user: cpuDelta.user.toFixed(3) + 's',
            system: cpuDelta.system.toFixed(3) + 's',
            total: (cpuDelta.user + cpuDelta.system).toFixed(3) + 's'
          },
          system: {
            before: initialMetrics.cpuUsage.toFixed(2) + '%',
            after: finalMetrics.cpuUsage.toFixed(2) + '%',
            delta: systemCpuDelta.toFixed(2) + '%'
          }
        },
        memoryUsage: {
          process: {
            rss: this.formatBytes(memoryDelta.rss),
            heapTotal: this.formatBytes(memoryDelta.heapTotal),
            heapUsed: this.formatBytes(memoryDelta.heapUsed)
          },
          system: {
            before: initialMetrics.memoryUsage.toFixed(2) + '%',
            after: finalMetrics.memoryUsage.toFixed(2) + '%',
            delta: systemMemoryDelta.toFixed(2) + '%'
          }
        },
        latency: `${latency}ms`,
        networkThroughput: initialMetrics.networkThroughput || 0
      },
      summary: {
        performance: duration < 100 ? 'Excellent' : duration < 500 ? 'Good' : duration < 1000 ? 'Fair' : 'Needs Optimization',
        cpuImpact: Math.abs(systemCpuDelta) < 5 ? 'Low' : Math.abs(systemCpuDelta) < 15 ? 'Medium' : 'High',
        memoryImpact: Math.abs(systemMemoryDelta) < 2 ? 'Low' : Math.abs(systemMemoryDelta) < 5 ? 'Medium' : 'High'
      }
    };
  }
  
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

module.exports = new PerformanceService();

