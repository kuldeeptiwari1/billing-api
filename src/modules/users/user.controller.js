const UserService = require('./user.service');
const helper = require('../../utils/helper');

const UserController = {

  add: async (httpRequest) => {
    const response = await UserService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await UserService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await UserService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await UserService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await UserService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = UserController;
