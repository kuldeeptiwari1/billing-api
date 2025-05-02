const jwt = require('jsonwebtoken');
module.exports = {
  generateJWT: async ({
    payload,
    secretKey = process.env.JWT_ACCESS_TOKEN_SECRET || "test2342323232scdcdvdsvfgvfvfdsvder4324234",
    signOption = { expiresIn: process.env.JWT_EXPIRE_IN || 7200 }
  }) => {
    try {
      const token = `${jwt.sign(payload, secretKey, signOption)}`;
      return token;
    } catch (error) {
      console.log('jwt token generate error ', error);
      return null;
    }
  },

  generateRefreshToken: async ({
    payload,
    secretKey = process.env.JWT_REFRESH_TOKEN_SECRET || 'testtestettetetetetesdfgsdfs55040534t',
    signOption = { expiresIn: process.env.JWT_REFRESH_EXPIRE_IN || 604800 } // Refresh token expires in 7 days
  }) => {
    try {
      const refreshToken = jwt.sign(payload, secretKey, signOption);
      return refreshToken;
    } catch (error) {
      console.log('jwt refresh token generate error ', error);
      return null;
    }
  },

  verifyJWT: (token, type = 'access') => {
    try {
      const secret = type === 'refresh' ? (process.env.JWT_REFRESH_TOKEN_SECRET || 'testtestettetetetetesdfgsdfs55040534t') : (process.env.JWT_ACCESS_TOKEN_SECRET || "test2342323232scdcdvdsvfgvfvfdsvder4324234");
      const expireIn = type === 'refresh' ? (process.env.JWT_REFRESH_EXPIRE_IN || 604800) : (process.env.JWT_EXPIRE_IN || 7200);
      
      const data = jwt.verify(token, secret, { expiresIn: expireIn });
      return data;
    } catch (error) {
      console.log('jwt token decode error ', error);
      return null;
    }
  }
};
