const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const axios = require('axios');

class NodeService {
  /**
   * Get all nodes
   */
  async getAllNodes() {
    try {
      const result = await db.query('SELECT * FROM nodes ORDER BY created_at DESC');
      return result.rows;
    } catch (error) {
      logger.error('Error fetching nodes:', error);
      throw error;
    }
  }

  /**
   * Get node by ID
   */
  async getNodeById(id) {
    try {
      const result = await db.query('SELECT * FROM nodes WHERE id = $1', [id]);
      if (result.rows.length === 0) {
        throw new Error('Node not found');
      }
      return result.rows[0];
    } catch (error) {
      logger.error('Error fetching node:', error);
      throw error;
    }
  }

  /**
   * Create a new node
   */
  async createNode(nodeData) {
    try {
      const id = uuidv4();
      const {
        name,
        host,
        port = 3000,
        api_key = null,
        location = null,
        description = null,
        metadata = {}
      } = nodeData;

      const query = `
        INSERT INTO nodes (id, name, host, port, api_key, location, description, metadata, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const result = await db.query(query, [
        id,
        name,
        host,
        port,
        api_key,
        location,
        description,
        JSON.stringify(metadata),
        'offline'
      ]);

      logger.info('Node created', { nodeId: id, name, host });
      return result.rows[0];
    } catch (error) {
      logger.error('Error creating node:', error);
      throw error;
    }
  }

  /**
   * Update a node
   */
  async updateNode(id, nodeData) {
    try {
      const {
        name,
        host,
        port,
        api_key,
        location,
        description,
        metadata
      } = nodeData;

      const updates = [];
      const values = [];
      let paramCount = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramCount++}`);
        values.push(name);
      }
      if (host !== undefined) {
        updates.push(`host = $${paramCount++}`);
        values.push(host);
      }
      if (port !== undefined) {
        updates.push(`port = $${paramCount++}`);
        values.push(port);
      }
      if (api_key !== undefined) {
        updates.push(`api_key = $${paramCount++}`);
        values.push(api_key);
      }
      if (location !== undefined) {
        updates.push(`location = $${paramCount++}`);
        values.push(location);
      }
      if (description !== undefined) {
        updates.push(`description = $${paramCount++}`);
        values.push(description);
      }
      if (metadata !== undefined) {
        updates.push(`metadata = $${paramCount++}`);
        values.push(JSON.stringify(metadata));
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE nodes
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await db.query(query, values);
      if (result.rows.length === 0) {
        throw new Error('Node not found');
      }

      logger.info('Node updated', { nodeId: id });
      return result.rows[0];
    } catch (error) {
      logger.error('Error updating node:', error);
      throw error;
    }
  }

  /**
   * Delete a node
   */
  async deleteNode(id) {
    try {
      const result = await db.query('DELETE FROM nodes WHERE id = $1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        throw new Error('Node not found');
      }
      logger.info('Node deleted', { nodeId: id });
      return result.rows[0];
    } catch (error) {
      logger.error('Error deleting node:', error);
      throw error;
    }
  }

  /**
   * Check node status and health
   */
  async checkNodeStatus(id) {
    try {
      const node = await this.getNodeById(id);
      const url = `http://${node.host}:${node.port}/api/v1/health`;
      
      const config = {};
      if (node.api_key) {
        config.headers = { 'Authorization': `Bearer ${node.api_key}` };
      }

      const startTime = Date.now();
      const response = await axios.get(url, { ...config, timeout: 5000 });
      const latency = Date.now() - startTime;

      const status = response.status === 200 ? 'online' : 'offline';
      
      // Update node status
      await db.query(
        'UPDATE nodes SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
        [status, id]
      );

      return {
        status,
        latency,
        response: response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Node is offline or unreachable
      await db.query(
        'UPDATE nodes SET status = $1 WHERE id = $2',
        ['offline', id]
      );

      return {
        status: 'offline',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Get node metrics
   */
  async getNodeMetrics(id) {
    try {
      const node = await this.getNodeById(id);
      const url = `http://${node.host}:${node.port}/api/v1/system/metrics`;
      
      const config = {};
      if (node.api_key) {
        config.headers = { 'Authorization': `Bearer ${node.api_key}` };
      }

      const response = await axios.get(url, { ...config, timeout: 5000 });
      
      return {
        nodeId: id,
        nodeName: node.name,
        metrics: response.data.data || response.data,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error fetching node metrics:', error);
      throw error;
    }
  }

  /**
   * Check all nodes status
   */
  async checkAllNodesStatus() {
    try {
      const nodes = await this.getAllNodes();
      const statusChecks = await Promise.allSettled(
        nodes.map(node => this.checkNodeStatus(node.id))
      );

      return nodes.map((node, index) => {
        const check = statusChecks[index];
        return {
          ...node,
          statusCheck: check.status === 'fulfilled' ? check.value : { status: 'offline', error: check.reason?.message }
        };
      });
    } catch (error) {
      logger.error('Error checking all nodes status:', error);
      throw error;
    }
  }
}

module.exports = new NodeService();

