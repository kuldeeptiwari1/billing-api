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
      studentName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      status: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      issueDate: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      course: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      taxPercentage: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      discount: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      totalPrice: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      baseAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      totalDiscount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      subtotal: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      totalTaxes: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      finalAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      isDeleted: Joi.boolean().default(false).messages({
        'boolean.base': 'must be true or false'
      })
    });
    return schema.validate(httpRequest.body, options);
  },

  update: (httpRequest) => {
    const schema = Joi.object({
      studentName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      status: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      issueDate: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      course: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      taxPercentage: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      discount: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      totalPrice: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      baseAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      totalDiscount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      subtotal: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      totalTaxes: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      finalAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      isDeleted: Joi.boolean().default(false).messages({
        'boolean.base': 'must be true or false'
      })
    });
    return schema.validate(httpRequest.body, options);
  }
};
