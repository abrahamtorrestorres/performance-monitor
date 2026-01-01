const Joi = require('joi');

const performanceMetricsSchema = Joi.object({
  cpuUsage: Joi.number().min(0).max(100).required(),
  memoryUsage: Joi.number().min(0).max(100).required(),
  networkThroughput: Joi.number().min(0).optional(),
  latency: Joi.number().min(0).optional(),
  metadata: Joi.object().optional()
});

const validatePerformanceMetrics = (req, res, next) => {
  const { error, value } = performanceMetricsSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }))
    });
  }

  req.body = value;
  next();
};

module.exports = {
  validatePerformanceMetrics
};

