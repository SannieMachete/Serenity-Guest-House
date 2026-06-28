// Recursively strip dangerous characters from request body
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    return val
      .replace(/[<>]/g, '') // Strip HTML tags
      .replace(/javascript:/gi, '') // Remove JS protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
  if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
    const sanitized = {};
    for (const key of Object.keys(val)) {
      sanitized[sanitizeValue(key)] = sanitizeValue(val[key]);
    }
    return sanitized;
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  return val;
};

const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  next();
};

module.exports = { sanitizeInputs };
