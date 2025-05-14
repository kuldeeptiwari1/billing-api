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
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    slug: Joi.string().messages({'string.base': 'slug must be a string', 'any.required': 'slug is required'}).allow(null, ''),
    code: Joi.string().messages({'string.base': 'code must be a string', 'any.required': 'code is required'}).allow(null, ''),
    closingDate: Joi.date().messages({'date.base': 'closingDate must be a valid date', 'any.required': 'closingDate is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    slug: Joi.string().messages({'string.base': 'slug must be a string', 'any.required': 'slug is required'}).allow(null, ''),
    code: Joi.string().messages({'string.base': 'code must be a string', 'any.required': 'code is required'}).allow(null, ''),
    closingDate: Joi.date().messages({'date.base': 'closingDate must be a valid date', 'any.required': 'closingDate is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  }
};
