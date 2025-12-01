// lib/security.js
import crypto from 'crypto';

const SECRET = process.env.likes_SECRET_KEY 
/**
 * Generates a hash signature based on IP and BlogID
 */
export const generateSignature = (blogid, ip) => {
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${blogid}-${ip}`)
    .digest('hex');
};

/**
 * Validates that the provided signature matches the current IP and BlogID
 */
export const validateSignature = (signature, blogid, ip) => {
  const expectedSignature = generateSignature(blogid, ip);
  return crypto.timingSafeEqual(
    Buffer.from(signature), 
    Buffer.from(expectedSignature)
  );
};