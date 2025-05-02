const ReportService = require('./report.service');
const helper = require('../../utils/helper');

const ReportController = {

  add: async (httpRequest) => {
    const response = await ReportService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await ReportService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await ReportService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await ReportService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await ReportService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = ReportController;
