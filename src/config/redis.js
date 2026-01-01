const redis = require('redis');
const logger = require('../utils/logger');

let client = null;

const initializeRedis = async () => {
  if (client) {
    return client;
  }

  client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          logger.error('Redis reconnection failed after 10 attempts');
          return new Error('Redis connection failed');
        }
        return retries * 100;
      }
    }
  });

  client.on('error', (err) => {
    logger.error('Redis Client Error:', err);
  });

  client.on('connect', () => {
    logger.info('Redis client connected');
  });

  client.on('ready', () => {
    logger.info('Redis client ready');
  });

  try {
    await client.connect();
    logger.info('Redis connection established');
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    // Don't throw - allow app to run without Redis in development
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }

  return client;
};

// Helper methods
const get = async (key) => {
  if (!client) {
    await initializeRedis();
  }
  try {
    return await client.get(key);
  } catch (error) {
    logger.error(`Redis GET error for key ${key}:`, error);
    return null;
  }
};

const set = async (key, value) => {
  if (!client) {
    await initializeRedis();
  }
  try {
    return await client.set(key, value);
  } catch (error) {
    logger.error(`Redis SET error for key ${key}:`, error);
    throw error;
  }
};

const setex = async (key, seconds, value) => {
  if (!client) {
    await initializeRedis();
  }
  try {
    return await client.setEx(key, seconds, value);
  } catch (error) {
    logger.error(`Redis SETEX error for key ${key}:`, error);
    throw error;
  }
};

const del = async (key) => {
  if (!client) {
    await initializeRedis();
  }
  try {
    return await client.del(key);
  } catch (error) {
    logger.error(`Redis DEL error for key ${key}:`, error);
    throw error;
  }
};

const ping = async () => {
  if (!client) {
    await initializeRedis();
  }
  return await client.ping();
};

const closeRedis = async () => {
  if (client) {
    await client.quit();
    client = null;
    logger.info('Redis connection closed');
  }
};

module.exports = {
  initializeRedis,
  get,
  set,
  setex,
  del,
  ping,
  closeRedis
};

