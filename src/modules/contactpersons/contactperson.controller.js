const ContactpersonService = require('./contactperson.service');
const helper = require('../../utils/helper');

const ContactpersonController = {

  add: async (httpRequest) => {
    const response = await ContactpersonService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await ContactpersonService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await ContactpersonService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await ContactpersonService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await ContactpersonService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = ContactpersonController;
