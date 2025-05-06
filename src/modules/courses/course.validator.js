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
      courseCode: Joi.string().required(),
      courseName: Joi.string().required(),
      department: Joi.string().required(),
      duration: Joi.string().required(),
      courseFees: Joi.string().required(),
      courseDescription: Joi.string().required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      courseCode: Joi.string().required(),
      courseName: Joi.string().required(),
      department: Joi.string().required(),
      duration: Joi.string().required(),
      courseFees: Joi.string().required(),
      courseDescription: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
