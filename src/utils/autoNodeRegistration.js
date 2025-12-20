const os = require('os');
const nodeService = require('../services/nodeService');
const logger = require('../utils/logger');

/**
 * Automatically register the current system as a node
 */
async function registerCurrentNode() {
  try {
    const hostname = os.hostname();
    const port = process.env.PORT || 3000;
    
    // Get all existing nodes
    const existingNodes = await nodeService.getAllNodes();
    
    // Check if a node with this hostname, localhost, or 127.0.0.1 already exists
    // Also check if any node has autoRegistered flag
    const existingNode = existingNodes.find(node => {
      const nodeHost = node.host?.toLowerCase();
      const isLocalhost = nodeHost === 'localhost' || nodeHost === '127.0.0.1' || nodeHost === hostname.toLowerCase();
      const isAutoRegistered = node.metadata && typeof node.metadata === 'object' && node.metadata.autoRegistered;
      return isLocalhost || isAutoRegistered;
    });
    
    if (existingNode) {
      logger.info('Current system already registered as node', { 
        nodeId: existingNode.id, 
        name: existingNode.name,
        host: existingNode.host
      });
      return existingNode;
    }
    
    // Try to get the actual host IP (for Docker, use host.docker.internal or localhost)
    // In Docker, we'll use localhost since the node will be accessed from outside
    let nodeHost = 'localhost';
    if (process.env.NODE_ENV !== 'production' && !process.env.DOCKER_ENV) {
      // If not in Docker, try to use hostname
      nodeHost = hostname;
    }
    
    // Create a new node for the current system
    const nodeData = {
      name: `Local System (${hostname})`,
      host: nodeHost,
      port: parseInt(port),
      location: 'Local',
      description: 'Automatically registered local system node',
      metadata: {
        platform: os.platform(),
        arch: os.arch(),
        hostname: hostname,
        autoRegistered: true,
        registeredAt: new Date().toISOString()
      }
    };
    
    const node = await nodeService.createNode(nodeData);
    logger.info('Current system registered as node', { 
      nodeId: node.id, 
      name: node.name,
      host: node.host,
      port: node.port
    });
    
    return node;
  } catch (error) {
    logger.error('Error registering current system as node:', error);
    // Don't throw - this is not critical for server startup
    return null;
  }
}

module.exports = {
  registerCurrentNode
};

