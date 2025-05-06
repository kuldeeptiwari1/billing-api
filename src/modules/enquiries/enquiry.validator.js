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
      student: Joi.string().required(),
      address: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      degree: Joi.string().required(),
      faculty: Joi.string().required(),
      passingYear: Joi.string().required(),
      collegeName: Joi.string().required(),
      course: Joi.string().required(),
      sourceType: Joi.string().required(),
      status: Joi.string().required(),
      notes: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      student: Joi.string().required(),
      address: Joi.string().required(),
      dateOfBirth: Joi.date().required(),
      degree: Joi.string().required(),
      faculty: Joi.string().required(),
      passingYear: Joi.string().required(),
      collegeName: Joi.string().required(),
      course: Joi.string().required(),
      sourceType: Joi.string().required(),
      status: Joi.string().required(),
      notes: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
