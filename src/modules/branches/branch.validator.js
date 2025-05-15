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
      name: Joi.string()
        .messages({ 'string.base': 'name must be a string', 'any.required': 'name is required' })
        .allow(null, ''),
      slug: Joi.string()
        .messages({ 'string.base': 'slug must be a string', 'any.required': 'slug is required' })
        .allow(null, ''),
      code: Joi.string()
        .messages({ 'string.base': 'code must be a string', 'any.required': 'code is required' })
        .allow(null, ''),
      address: Joi.string()
        .messages({ 'string.base': 'address must be a string', 'any.required': 'address is required' })
        .allow(null, ''),
      email: Joi.string()
        .messages({ 'string.base': 'email must be a string', 'any.required': 'email is required' })
        .allow(null, ''),
      contact: Joi.string()
        .messages({ 'string.base': 'contact must be a string', 'any.required': 'contact is required' })
        .allow(null, ''),
      closingDay: Joi.number().default(5)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      name: Joi.string()
        .messages({ 'string.base': 'name must be a string', 'any.required': 'name is required' })
        .allow(null, ''),
      slug: Joi.string()
        .messages({ 'string.base': 'slug must be a string', 'any.required': 'slug is required' })
        .allow(null, ''),
      code: Joi.string()
        .messages({ 'string.base': 'code must be a string', 'any.required': 'code is required' })
        .allow(null, ''),
      address: Joi.string()
        .messages({ 'string.base': 'address must be a string', 'any.required': 'address is required' })
        .allow(null, ''),
      email: Joi.string()
        .messages({ 'string.base': 'email must be a string', 'any.required': 'email is required' })
        .allow(null, ''),
      contact: Joi.string()
        .messages({ 'string.base': 'contact must be a string', 'any.required': 'contact is required' })
        .allow(null, ''),
      closingDay: Joi.number().default(5)
    });
    return schema.validate(httpRequest.body, options);
  }
};
