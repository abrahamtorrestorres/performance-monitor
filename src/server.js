const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./utils/logger');
const performanceRoutes = require('./routes/performance');
const healthRoutes = require('./routes/health');
const metricsRoutes = require('./routes/metrics');
const systemRoutes = require('./routes/system');
const nodeRoutes = require('./routes/nodes');
const authRoutes = require('./routes/auth');
const { initializeDatabase } = require('./config/database');
const { initializeRedis } = require('./config/redis');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: false
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, { ip: req.ip });
  next();
});

// API Routes (must be before static files)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1/nodes', nodeRoutes);

// Serve static files (dashboard) - after API routes
app.use(express.static('public'));

// API info endpoint (for programmatic access)
app.get('/api', (req, res) => {
  res.json({
    service: 'Intel Cloud Performance Service',
    version: '1.0.0',
    status: 'operational',
    endpoints: {
      performance: '/api/v1/performance',
      health: '/api/v1/health',
      metrics: '/api/v1/metrics'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Endpoint not found',
      status: 404
    }
  });
});

// Initialize services and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    logger.info('Database connection established');

    // Initialize Redis connection
    await initializeRedis();
    logger.info('Redis connection established');

    // Auto-register current system as a node
    const { registerCurrentNode } = require('./utils/autoNodeRegistration');
    await registerCurrentNode();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`, {
        environment: process.env.NODE_ENV || 'development',
        port: PORT
      });
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

module.exports = app;

