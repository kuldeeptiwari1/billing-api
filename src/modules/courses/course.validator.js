const Joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const options = {
  errors: {
    wrap: {
      label: ''
    }
  },
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true
};

module.exports = {
  add: (httpRequest) => {
    const schema = Joi.object({
      courseCode: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      courseName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      department: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      duration: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      courseFees: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      courseDescription: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      price: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      courseCode: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      courseName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      department: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      duration: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      courseFees: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      courseDescription: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      price: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
