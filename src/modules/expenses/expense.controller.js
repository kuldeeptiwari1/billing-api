const ExpenseService = require('./expense.service');
const helper = require('../../utils/helper');

const ExpenseController = {

  add: async (httpRequest) => {
    const response = await ExpenseService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await ExpenseService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await ExpenseService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await ExpenseService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await ExpenseService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = ExpenseController;
