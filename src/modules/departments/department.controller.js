const DepartmentService = require('./department.service');
const helper = require('../../utils/helper');

const DepartmentController = {

  add: async (httpRequest) => {
    const response = await DepartmentService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await DepartmentService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await DepartmentService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await DepartmentService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await DepartmentService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = DepartmentController;
