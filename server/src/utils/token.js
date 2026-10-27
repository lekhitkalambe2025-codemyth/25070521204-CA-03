import jwt from 'jsonwebtoken';

/**
 * Generate JWT token for an authenticated user
 * @param {string} userId - Mongo ObjectId of user
 * @param {string} role - customer or admin
 * @returns {string} Signed JWT
 */
export const generateToken = (userId, role = 'customer') => {
  const secret = process.env.JWT_SECRET || 'tatva_dev_fallback_secret_key_change_in_production_32chars';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '7d',
  });
};

/**
 * Verify and decode JWT token
 * @param {string} token
 * @returns {object} Decoded payload
 */
export const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'tatva_dev_fallback_secret_key_change_in_production_32chars';
  return jwt.verify(token, secret);
};
