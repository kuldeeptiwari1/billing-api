const BranchService = require('./branch.service');
const helper = require('../../utils/helper');

const BranchController = {

  add: async (httpRequest) => {
    const response = await BranchService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await BranchService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await BranchService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await BranchService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await BranchService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = BranchController;
