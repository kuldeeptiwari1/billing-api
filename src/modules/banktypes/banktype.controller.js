const BanktypeService = require('./banktype.service');
const helper = require('../../utils/helper');

const BanktypeController = {

  add: async (httpRequest) => {
    const response = await BanktypeService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await BanktypeService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await BanktypeService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await BanktypeService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await BanktypeService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = BanktypeController;
