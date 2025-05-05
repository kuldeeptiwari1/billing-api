const ModeofpaymentService = require('./modeofpayment.service');
const helper = require('../../utils/helper');

const ModeofpaymentController = {

  add: async (httpRequest) => {
    const response = await ModeofpaymentService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await ModeofpaymentService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await ModeofpaymentService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await ModeofpaymentService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await ModeofpaymentService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = ModeofpaymentController;
