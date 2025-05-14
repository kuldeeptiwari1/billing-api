const BankService = require('./bank.service');
const helper = require('../../utils/helper');

const BankController = {

  add: async (httpRequest) => {
    const response = await BankService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await BankService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await BankService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await BankService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await BankService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = BankController;
