const helper = require('../../utils/helper');
const AuthService = require('./auth.service');

const AuthController = {
  login: async (httpRequest) => {
    const loginData = await AuthService.doLogin(httpRequest.body);
    httpRequest.headers.Authorization = loginData.accessToken;
    return helper.generateResponse(loginData);
  },

  refreshLogin: async (httpRequest) => {
    const loginRefeshData = await AuthService.refreshLogin(httpRequest.body);
    httpRequest.headers.Authorization = loginRefeshData.accessToken;
    return helper.generateResponse(loginRefeshData);
  },

  register: async (httpRequest) => {
    const registerData = await AuthService.doRegistration({
      ...httpRequest.body,
      selfReferralCode: helper.generateReferralCode()
    });
    return helper.generateResponse(registerData);
  },

  resetPassword: async (httpRequest) => {
    const passwordData = await AuthService.resetPassword({
      password: helper.generatePassword(),
      ...httpRequest.body
    });
    return helper.generateResponse(passwordData);
  },

  logout: async (httpRequest) => {
    try {
      const response = await AuthService.doLogout(httpRequest);
      return {
        statusCode: response.statusCode,
        body: response
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        statusCode: 500,
        body: { message: 'Internal server error' }
      };
    }
  },

  getProfile: async (httpRequest) => {
    const data = await AuthService.getProfile(httpRequest);
    return helper.generateResponse(data);
  },

  getProfileByToken: async (httpRequest) => {
    const data = await AuthService.getProfileByToken(httpRequest);
    return helper.generateResponse(data);
  },

  authMe: async (httpRequest) => {
    const data = await AuthService.authMe(httpRequest);
    return helper.generateResponse(data);
  },

  loginUsingAccessToken: async (httpRequest) => {
    const payload = await AuthService.loginUsingAccessToken({
      ...httpRequest
    });
    return helper.generateResponse(payload);
  }
};

module.exports = AuthController;
