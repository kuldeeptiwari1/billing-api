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
    phone: Joi.string().messages({'string.base': 'phone must be a string', 'any.required': 'phone is required'}).allow(null, ''),
    email: Joi.string().messages({'string.base': 'email must be a string', 'any.required': 'email is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    phone: Joi.string().messages({'string.base': 'phone must be a string', 'any.required': 'phone is required'}).allow(null, ''),
    email: Joi.string().messages({'string.base': 'email must be a string', 'any.required': 'email is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  }
};
