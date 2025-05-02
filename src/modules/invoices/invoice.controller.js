const InvoiceService = require('./invoice.service');
const helper = require('../../utils/helper');

const InvoiceController = {

  add: async (httpRequest) => {
    const response = await InvoiceService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await InvoiceService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await InvoiceService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await InvoiceService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await InvoiceService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = InvoiceController;
