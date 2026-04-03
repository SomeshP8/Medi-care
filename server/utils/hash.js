const crypto = require('crypto');

const generateSHA256 = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = { generateSHA256 };
