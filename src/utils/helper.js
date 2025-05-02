const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const referralCodes = require('referral-codes');

/**
 * Get the ID parameter from a request object.
 * @param {object} req - The request object.
 * @returns {number} - The ID parameter as a number.
 * @throws {TypeError} - If the ID parameter is not a valid number.
 */
function getIdParam(req) {
  const { id } = req.params;
  if (/^\d+$/.test(id)) {
    return Number.parseInt(id, 10);
  }
  throw new TypeError(`Invalid ':id' param: "${id}"`);
}

/**
 * Generates a standard response object for API responses.
 *
 * @param {Object} options - Response options.
 * @param {number} [options.statusCode=200] - HTTP status code.
 * @param {*} [options.data={}] - Data to include in the response.
 * @param {boolean} [options.isError=false] - Indicates if the response represents an error.
 * @param {string} [options.message='Request successful'] - Response message.
 * @param {string} [options.returnType='json'] - Type of response.
 * @returns {Object} The response object.
 */
function generateResponse({
  statusCode = 200,
  data = {},
  isError = false,
  message = 'Request successful',
  returnType = 'json',
  errorStack = null,
  pagination = {}
}) {
  if (Object.keys(pagination).length > 0) {
    return { statusCode, isError, data, message, returnType, errorStack, pagination };
  } else {
    return { statusCode, isError, data, message, returnType, errorStack };
  }
}

function generateReferralCode() {
  return referralCodes.generate({
    prefix: 'SM',
    length: 6,
    count: 1,
    charset: referralCodes.charset('numbers')
  });
}

function generatePassword(
  length = 8,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) {
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');
}

async function hashPassword(password, saltRounds = 10) {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Password hashing failed');
  }
}

function getUserRoleLabel() {
  return {
    0: 'User',
    1: 'Developer',
    2: 'Accountant',
    3: 'Manager',
    4: 'Admin',
    5: 'Student',
    6: 'HR'
  };
}

function getUserRoleNumber() {
  return {
    User: 0,
    Developer: 1,
    Accountant: 2,
    Manager: 3,
    Admin: 4,
    Student: 5,
    HR: 6
  };
}

function base64ToBlob(base64, contentType) {
  const byteCharacters = Buffer.from(base64, 'base64').toString('binary');
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = Array.from(slice).map((ch) => ch.charCodeAt(0));
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: contentType });
}

function base64ToFile(dataUrl, filename) {
  const [meta, base64] = dataUrl.split(',');
  const contentType = meta.match(/:(.*?);/)[1];
  const blob = base64ToBlob(base64, contentType);
  return new File([blob], filename, { type: contentType });
}

function encrypt(text) {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.SECURE_KEY),
    Buffer.from(process.env.SECURE_IV)
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decrypt(text) {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.SECURE_KEY),
    Buffer.from(process.env.SECURE_IV)
  );
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function extractEmail(ldapString) {
  const match = ldapString?.match(/uid=([^,]+)/);
  return match ? `${match[1]}@ssaihq.com` : 'Not set';
}

module.exports = {
  getIdParam,
  generateResponse,
  generatePassword,
  hashPassword,
  getUserRoleLabel,
  getUserRoleNumber,
  generateReferralCode,
  base64ToFile,
  encrypt,
  decrypt,
  extractEmail
};
