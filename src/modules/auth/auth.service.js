const { PrismaClient: AUTHPrisma } = require('../../../prisma/auth/generated');
const prisma = new AUTHPrisma();
const bcrypt = require('bcryptjs');
const JwtService = require('../../utils/jwt');
const { getMessage } = require('../../utils/constant');
// const { PrismaClient: MTRPrisma } = require('../../../prisma/modulestorole/generated');
// const prismamtr = new MTRPrisma();

const AuthService = {
  doLogin: async (requestBody) => {
    const { identifier = '', password } = requestBody; // `identifier` can be email or mobile
    let user;

    try {
      // Find user by email or mobile
      user = await prisma.user.findFirst({
        where: {
          OR: [{ email: identifier.toLowerCase() }, { mobile: identifier }]
        }
      });

      // If user is not found
      if (!user) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'userNotFound', 'auth'),
          errorStack: null
        };
      }

      // Check if password matches
      const passwordMatch = bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return {
          data: null,
          statusCode: 401,
          isError: true,
          message: getMessage('en', 'error', 'invalidCredentials', 'auth'),
          errorStack: null
        };
      }

      // Prepare JWT payload
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const accessToken = await JwtService.generateJWT({ payload });
      const refreshToken = await JwtService.generateRefreshToken({ payload });

      if (!accessToken || !refreshToken) {
        return {
          data: null,
          statusCode: 500,
          isError: true,
          message: getMessage('en', 'error', 'tokenFailed', 'auth'),
          errorStack: null
        };
      }

      return {
        data: { token: accessToken, refreshToken, expireIn: process.env.JWT_EXPIRE_IN },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'loginSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'loginFailed', 'auth'),
        errorStack: error
      };
    }
  },

  doRegistration: async (requestBody) => {
    try {
      const { email, mobile, password, role = 'user' } = requestBody; // Default role is "user"
      const hashedPassword = bcrypt.hashSync(password, 8);

      // Check if the email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ email: email.toLowerCase() }, { mobile: mobile }]
        }
      });

      if (existingUser) {
        return {
          data: null,
          statusCode: 400,
          isError: true,
          message: getMessage('en', 'error', 'duplicateUser', 'auth'),
          errorStack: null
        };
      }

      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          mobile: mobile,
          role: role.toLowerCase(),
          password: hashedPassword
        }
      });

      return {
        data: user,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'registerSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'registerFailed', 'auth'),
        errorStack: error
      };
    }
  },

  resetPassword: async (requestBody) => {
    try {
      const { email, password } = requestBody;
      const hashedPassword = bcrypt.hashSync(password, 8);

      // Update password in database
      await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { password: hashedPassword }
      });

      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'error', 'resetSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Password reset failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'resetFailed', 'auth'),
        errorStack: error
      };
    }
  },

  doLogout: async (requestBody) => {
    try {
      requestBody.session.destroy();
      return {
        data: null,
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'error', 'logoutSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Logout failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'logoutFailed', 'auth'),
        errorStack: error
      };
    }
  },

  refreshLogin: async (requestBody) => {
    const { refreshToken } = requestBody;

    if (!refreshToken) {
      return {
        data: null,
        statusCode: 400,
        isError: true,
        message: getMessage('en', 'error', 'tokenMissing', 'auth'),
        errorStack: null
      };
    }

    try {
      // Verify refresh token
      const decoded = JwtService.verifyJWT(refreshToken, 'refresh');

      if (!decoded) {
        return {
          data: null,
          statusCode: 401,
          isError: true,
          message: getMessage('en', 'error', 'invalidToken', 'auth'),
          errorStack: null
        };
      }

      // Find user in DB
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true }
      });

      if (!user) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'userNotFound', 'auth'),
          errorStack: null
        };
      }

      // Generate new access token
      const newAccessToken = await JwtService.generateJWT({
        payload: { id: user.id, email: user.email, role: user.role }
      });
      // Generate new access token
      const newRefreshToken = await JwtService.generateRefreshToken({
        payload: { id: user.id, email: user.email, role: user.role }
      });

      return {
        data: { token: newAccessToken, refreshToken: newRefreshToken, expireIn: process.env.JWT_EXPIRE_IN },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'loginSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Refresh login failed:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'loginFailed', 'auth'),
        errorStack: error
      };
    }
  },

  getProfileByToken: async (httpRequest) => {
    try {
      const { token } = httpRequest.body;
      if (!token || token == '') {
        return {
          data: null,
          statusCode: 401,
          isError: true,
          message: getMessage('en', 'error', 'tokenMissing', 'auth'),
          errorStack: null
        };
      }

      // Verify and decode the token
      const decoded = JwtService.verifyJWT(token, 'access');
      if (!decoded) {
        return {
          data: null,
          statusCode: 401,
          isError: true,
          message: getMessage('en', 'error', 'invalidToken', 'auth'),
          errorStack: null
        };
      }

      // Fetch user from the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }, // Use the user ID from the token
        select: { id: true, email: true, role: true }
      });

      // Fetch allowed modules and operations for the role
      const allowedModulesToRole = []
      // await prismamtr.mtr.findUnique({
      //   where: { role: user.role.toLowerCase() },
      //   select: { modules: true }
      // });

      if (!user) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'userNotFound', 'auth'),
          errorStack: null
        };
      }

      return {
        data: { ...user, allowedModules: allowedModulesToRole },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'profileSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'profileFailed', 'auth'),
        errorStack: error
      };
    }
  },

  getProfile: async (httpRequest) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: httpRequest.user.email },
        select: { id: true, email: true, role: true }
      });

      if (!user) {
        return {
          data: null,
          statusCode: 404,
          isError: true,
          message: getMessage('en', 'error', 'userNotFound', 'auth'),
          errorStack: null
        };
      }

      return {
        data: {
          email: user.email,
          role: user.role
        },
        statusCode: 200,
        isError: false,
        message: getMessage('en', 'success', 'profileSuccess', 'auth'),
        errorStack: null
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        data: null,
        statusCode: 500,
        isError: true,
        message: getMessage('en', 'error', 'profileFailed', 'auth'),
        errorStack: error
      };
    }
  }
};

module.exports = AuthService;
