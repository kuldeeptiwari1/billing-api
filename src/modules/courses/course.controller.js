const CourseService = require('./course.service');
const helper = require('../../utils/helper');

const CourseController = {

  add: async (httpRequest) => {
    const response = await CourseService.add(httpRequest.body);
    return helper.generateResponse(response);
  },

  list: async (httpRequest) => {
    const response = await CourseService.list(httpRequest.query);
    return helper.generateResponse(response);
  },

  view: async (httpRequest) => {
    const response = await CourseService.view(httpRequest.params.id);
    return helper.generateResponse(response);
  },

  update: async (httpRequest) => {
    const response = await CourseService.update(httpRequest.params.id, httpRequest.body);
    return helper.generateResponse(response);
  },

  delete: async (httpRequest) => {
    const response = await CourseService.delete(httpRequest.params.id);
    return helper.generateResponse(response);
  }
};

module.exports = CourseController;
