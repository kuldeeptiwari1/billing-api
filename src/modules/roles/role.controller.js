const RoleService = require('./role.service');
const helper = require('../../utils/helper');

const RoleController = {

  add: async (httpRequest) => {
    const response = await RoleService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await RoleService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await RoleService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await RoleService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await RoleService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = RoleController;
