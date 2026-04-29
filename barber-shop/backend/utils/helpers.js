/**
 * Format a consistent API response.
 */
exports.formatResponse = (data, message = 'Success', status = 200) => ({
  status,
  message,
  data,
});

/**
 * Parse pagination query params with defaults.
 */
exports.parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Generate a random alphanumeric code.
 */
exports.generateCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};
