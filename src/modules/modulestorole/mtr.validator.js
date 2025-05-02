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
      role: Joi.string().required(),
      modules: Joi.any().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      role: Joi.string().required(),
      modules: Joi.any().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
