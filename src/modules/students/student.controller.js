const StudentService = require('./student.service');
const helper = require('../../utils/helper');

const StudentController = {

  add: async (httpRequest) => {
    const response = await StudentService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await StudentService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await StudentService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await StudentService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await StudentService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = StudentController;
