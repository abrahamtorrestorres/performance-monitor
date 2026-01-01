const request = require('supertest');
const app = require('../server');
const { initializeDatabase, closeDatabase } = require('../config/database');
const { closeRedis } = require('../config/redis');

let pool;

beforeAll(async () => {
  pool = await initializeDatabase();
  // Ensure the performance_metrics table exists with all required columns
  await pool.query(`
    CREATE TABLE IF NOT EXISTS performance_metrics (
      id VARCHAR(255) PRIMARY KEY,
      cpu_usage DECIMAL(5,2),
      memory_usage DECIMAL(5,2),
      network_throughput DECIMAL(10,2),
      latency DECIMAL(10,2),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

afterAll(async () => {
  await closeDatabase();
  await closeRedis();
});

describe('Performance API', () => {
  describe('POST /api/v1/performance/metrics', () => {
    it('should submit performance metrics successfully', async () => {
      const metrics = {
        cpuUsage: 45.5,
        memoryUsage: 62.3,
        networkThroughput: 1000.5,
        latency: 25.2,
        metadata: {
          type: 'system',
          instance: 'web-server-1'
        }
      };

      const response = await request(app)
        .post('/api/v1/performance/metrics')
        .send(metrics)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/performance/metrics')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/performance/metrics', () => {
    it('should retrieve metrics list', async () => {
      const response = await request(app)
        .get('/api/v1/performance/metrics')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('POST /api/v1/performance/analyze', () => {
    it('should analyze performance and return recommendations', async () => {
      const metrics = {
        cpuUsage: 85,
        memoryUsage: 70,
        latency: 120
      };

      const response = await request(app)
        .post('/api/v1/performance/analyze')
        .send(metrics)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('recommendations');
      expect(response.body.data).toHaveProperty('score');
    });
  });

  describe('GET /api/v1/performance/benchmark', () => {
    it('should run benchmark successfully', async () => {
      const response = await request(app)
        .get('/api/v1/performance/benchmark')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('duration');
      expect(response.body.data).toHaveProperty('throughput');
    });
  });
});

describe('Health API', () => {
  describe('GET /api/v1/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/v1/health')
        .expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/v1/health/ready', () => {
    it('should return readiness status', async () => {
      const response = await request(app)
        .get('/api/v1/health/ready')
        .expect(200);

      expect(response.body).toHaveProperty('ready');
    });
  });

  describe('GET /api/v1/health/live', () => {
    it('should return liveness status', async () => {
      const response = await request(app)
        .get('/api/v1/health/live')
        .expect(200);

      expect(response.body).toHaveProperty('alive');
      expect(response.body.alive).toBe(true);
    });
  });
});

