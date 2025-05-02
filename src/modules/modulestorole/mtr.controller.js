const MtrService = require('./mtr.service');
const helper = require('../../utils/helper');

const MtrController = {

  add: async (httpRequest) => {
    const response = await MtrService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await MtrService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await MtrService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await MtrService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await MtrService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = MtrController;
