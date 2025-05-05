const EnquiryService = require('./enquiry.service');
const helper = require('../../utils/helper');

const EnquiryController = {

  add: async (httpRequest) => {
    const response = await EnquiryService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await EnquiryService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await EnquiryService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await EnquiryService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await EnquiryService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = EnquiryController;
