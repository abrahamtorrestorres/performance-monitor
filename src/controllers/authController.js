const logger = require('../utils/logger');

class AuthController {
  login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      // Get credentials from environment variables (with defaults for development)
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
      
      // Check credentials
      if (username === adminUsername && password === adminPassword) {
        // In a real app, you'd generate a JWT token here
        // For now, we'll use a simple session approach
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        
        logger.info('User logged in', { username });
        
        res.json({
          success: true,
          token: token,
          message: 'Login successful'
        });
      } else {
        logger.warn('Failed login attempt', { username });
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
    } catch (error) {
      logger.error('Error during login:', error);
      next(error);
    }
  }

  logout(req, res, next) {
    try {
      logger.info('User logged out');
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Error during logout:', error);
      next(error);
    }
  }

  checkAuth(req, res, next) {
    try {
      // Simple check - in production, verify JWT token
      const token = req.headers.authorization;
      if (token) {
        res.json({
          success: true,
          authenticated: true
        });
      } else {
        res.json({
          success: true,
          authenticated: false
        });
      }
    } catch (error) {
      logger.error('Error checking auth:', error);
      next(error);
    }
  }
}

module.exports = new AuthController();

