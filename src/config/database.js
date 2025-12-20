const { Pool } = require('pg');
const logger = require('../utils/logger');

let pool = null;

const initializeDatabase = async () => {
  if (pool) {
    return pool;
  }

  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'performance_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err) => {
    logger.error('Unexpected error on idle client', err);
  });

  // Test connection
  try {
    await pool.query('SELECT NOW()');
    logger.info('Database connection pool created successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }

  // Initialize schema
  await initializeSchema();

  return pool;
};

const initializeSchema = async () => {
  const createTableQuery = `
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

    CREATE INDEX IF NOT EXISTS idx_timestamp ON performance_metrics(timestamp);
    CREATE INDEX IF NOT EXISTS idx_metadata_type ON performance_metrics USING GIN (metadata);

    CREATE TABLE IF NOT EXISTS nodes (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      host VARCHAR(255) NOT NULL,
      port INTEGER DEFAULT 3000,
      api_key VARCHAR(255),
      status VARCHAR(50) DEFAULT 'offline',
      last_seen TIMESTAMP,
      location VARCHAR(255),
      description TEXT,
      metadata JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_nodes_status ON nodes(status);
    CREATE INDEX IF NOT EXISTS idx_nodes_host ON nodes(host);
  `;

  try {
    await pool.query(createTableQuery);
    logger.info('Database schema initialized');
  } catch (error) {
    logger.error('Failed to initialize schema:', error);
    throw error;
  }
};

const query = async (text, params) => {
  if (!pool) {
    await initializeDatabase();
  }
  return pool.query(text, params);
};

module.exports = {
  initializeDatabase,
  query
};

