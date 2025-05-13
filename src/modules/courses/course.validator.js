const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const options = {
  errors: { wrap: { label: '' } },
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true
};

module.exports = {
  add: (httpRequest) => {
    const schema = Joi.object({
    code: Joi.string().messages({'string.base': 'code must be a string', 'any.required': 'code is required'}).allow(null, ''),
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    departmentIds: Joi.any().messages({'any.required': 'departmentIds is required'}).required(),
    branchIds: Joi.any().messages({'any.required': 'branchIds is required'}).required(),
    durationInMonths: Joi.number().integer().messages({'number.base': 'durationInMonths must be an integer', 'any.required': 'durationInMonths is required'}).allow(null, ''),
    courseFees: Joi.number().precision(2).messages({'number.base': 'courseFees must be a decimal', 'any.required': 'courseFees is required'}).allow(null, ''),
    courseDescription: Joi.string().messages({'string.base': 'courseDescription must be a string', 'any.required': 'courseDescription is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
    code: Joi.string().messages({'string.base': 'code must be a string', 'any.required': 'code is required'}).allow(null, ''),
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    departmentIds: Joi.any().messages({'any.required': 'departmentIds is required'}).required(),
    branchIds: Joi.any().messages({'any.required': 'branchIds is required'}).required(),
    durationInMonths: Joi.number().integer().messages({'number.base': 'durationInMonths must be an integer', 'any.required': 'durationInMonths is required'}).allow(null, ''),
    courseFees: Joi.number().precision(2).messages({'number.base': 'courseFees must be a decimal', 'any.required': 'courseFees is required'}).allow(null, ''),
    courseDescription: Joi.string().messages({'string.base': 'courseDescription must be a string', 'any.required': 'courseDescription is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  }
};
