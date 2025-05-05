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
      receiptDate: Joi.date()
        .messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' })
        .required(),
      studentName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      phone: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      email: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      course: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      totalAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paidReceiptAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      remainingAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      fineAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      selectSeries: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPerson1: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonNo1: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonEmail1: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPerson2: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonNo2: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonEmail2: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paymentMode: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      bankType: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      paytmAccount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      feesDueDate: Joi.date()
        .messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' })
        .required(),
      bookIssue: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      bookCode: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      ReceiptType: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paymentDetails: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      dueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      notes: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      receiptDate: Joi.date()
        .messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' })
        .required(),
      studentName: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      phone: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      email: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      course: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      totalAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paidReceiptAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      remainingAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      fineAmount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      selectSeries: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPerson1: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonNo1: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonEmail1: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPerson2: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonNo2: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      contactPersonEmail2: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paymentMode: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      bankType: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      paytmAccount: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      feesDueDate: Joi.date()
        .messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' })
        .required(),
      bookIssue: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      bookCode: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      ReceiptType: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      paymentDetails: Joi.string()
        .messages({ 'string.base': 'must be a string', 'any.required': 'is required' })
        .required(),
      dueDate: Joi.date().messages({ 'date.base': 'must be a valid date', 'any.required': 'is required' }).required(),
      notes: Joi.string().messages({ 'string.base': 'must be a string', 'any.required': 'is required' }).required(),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'must be true or false', 'any.required': 'is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
