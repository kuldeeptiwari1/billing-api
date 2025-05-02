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
      name: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      email: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      phone: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      gender: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      state: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      city: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      courseName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPerson: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      modeOfClass: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      department: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      totalFees: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      remainingFees: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      dueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      preferredBranch: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paymentType: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      documentType: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      documentNo: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      profession: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      preferredBatch: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      name: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      email: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      phone: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      gender: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      state: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      city: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      courseName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPerson: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      modeOfClass: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      department: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      totalFees: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      remainingFees: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      dueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      preferredBranch: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paymentType: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      documentType: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      documentNo: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      profession: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      preferredBatch: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
