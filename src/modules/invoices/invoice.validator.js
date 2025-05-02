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
      // invoiceNo: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),

      studentName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      counsellorName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      phone: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      contactPerson: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      status: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),

      totalAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      issueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      dueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      course: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      // invoiceNo: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      studentName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      counsellorName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      phone: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      contactPerson: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      status: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),

      totalAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),

      issueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      dueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      course: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
