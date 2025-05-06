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
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      designation: Joi.string().required(),
      password: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      designation: Joi.string().required(),
      password: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
