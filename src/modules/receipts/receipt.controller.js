const ReceiptService = require('./receipt.service');
const helper = require('../../utils/helper');

const ReceiptController = {

  add: async (httpRequest) => {
    const response = await ReceiptService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await ReceiptService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await ReceiptService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await ReceiptService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await ReceiptService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = ReceiptController;
