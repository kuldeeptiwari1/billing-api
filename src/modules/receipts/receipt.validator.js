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
      receiptNo: Joi.string()
        .messages({ 'string.base': 'receiptNo must be a string', 'any.required': 'receiptNo is required' })
        .allow(null, ''),
      receiptDate: Joi.date()
        .messages({ 'date.base': 'receiptDate must be a valid date', 'any.required': 'receiptDate is required' })
        .allow(null, ''),
      studentId: Joi.string()
        .messages({ 'string.base': 'studentId must be a string', 'any.required': 'studentId is required' })
        .allow(null, ''),
      contactPersonIds: Joi.string()
        .messages({
          'string.base': 'contactPersonIds must be a string',
          'any.required': 'contactPersonIds is required'
        })
        .allow(null, ''),
      totalAmount: Joi.string()
        .messages({ 'string.base': 'totalAmount must be a string', 'any.required': 'totalAmount is required' })
        .allow(null, ''),
      paidReceiptAmount: Joi.string()
        .messages({
          'string.base': 'paidReceiptAmount must be a string',
          'any.required': 'paidReceiptAmount is required'
        })
        .allow(null, ''),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'paidAmount must be a string', 'any.required': 'paidAmount is required' })
        .allow(null, ''),
      remainingAmount: Joi.string()
        .messages({ 'string.base': 'remainingAmount must be a string', 'any.required': 'remainingAmount is required' })
        .allow(null, ''),
      fineAmount: Joi.string()
        .messages({ 'string.base': 'fineAmount must be a string', 'any.required': 'fineAmount is required' })
        .allow(null, ''),
      paymentMode: Joi.string()
        .messages({ 'string.base': 'paymentMode must be a string', 'any.required': 'paymentMode is required' })
        .allow(null, ''),
      paymentModeType: Joi.string()
        .messages({ 'string.base': 'paymentModeType must be a string', 'any.required': 'paymentModeType is required' })
        .allow(null, ''),
      paymentModeName: Joi.string()
        .messages({ 'string.base': 'paymentModeName must be a string', 'any.required': 'paymentModeName is required' })
        .allow(null, ''),
      bookIssue: Joi.string()
        .messages({ 'string.base': 'bookIssue must be a string', 'any.required': 'bookIssue is required' })
        .allow(null, ''),
      bookCode: Joi.string()
        .messages({ 'string.base': 'bookCode must be a string', 'any.required': 'bookCode is required' })
        .allow(null, ''),
      ReceiptType: Joi.string()
        .messages({ 'string.base': 'ReceiptType must be a string', 'any.required': 'ReceiptType is required' })
        .allow(null, ''),
      paymentDetails: Joi.string()
        .messages({ 'string.base': 'paymentDetails must be a string', 'any.required': 'paymentDetails is required' })
        .allow(null, ''),
      notes: Joi.string()
        .messages({ 'string.base': 'notes must be a string', 'any.required': 'notes is required' })
        .allow(null, ''),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'isDeleted must be true or false', 'any.required': 'isDeleted is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      receiptNo: Joi.string()
        .messages({ 'string.base': 'receiptNo must be a string', 'any.required': 'receiptNo is required' })
        .allow(null, ''),
      receiptDate: Joi.date()
        .messages({ 'date.base': 'receiptDate must be a valid date', 'any.required': 'receiptDate is required' })
        .allow(null, ''),
      studentId: Joi.string()
        .messages({ 'string.base': 'studentId must be a string', 'any.required': 'studentId is required' })
        .allow(null, ''),
      contactPersonIds: Joi.string()
        .messages({
          'string.base': 'contactPersonIds must be a string',
          'any.required': 'contactPersonIds is required'
        })
        .allow(null, ''),
      totalAmount: Joi.string()
        .messages({ 'string.base': 'totalAmount must be a string', 'any.required': 'totalAmount is required' })
        .allow(null, ''),
      paidReceiptAmount: Joi.string()
        .messages({
          'string.base': 'paidReceiptAmount must be a string',
          'any.required': 'paidReceiptAmount is required'
        })
        .allow(null, ''),
      paidAmount: Joi.string()
        .messages({ 'string.base': 'paidAmount must be a string', 'any.required': 'paidAmount is required' })
        .allow(null, ''),
      remainingAmount: Joi.string()
        .messages({ 'string.base': 'remainingAmount must be a string', 'any.required': 'remainingAmount is required' })
        .allow(null, ''),
      fineAmount: Joi.string()
        .messages({ 'string.base': 'fineAmount must be a string', 'any.required': 'fineAmount is required' })
        .allow(null, ''),
      paymentMode: Joi.string()
        .messages({ 'string.base': 'paymentMode must be a string', 'any.required': 'paymentMode is required' })
        .allow(null, ''),
      paymentModeType: Joi.string()
        .messages({ 'string.base': 'paymentModeType must be a string', 'any.required': 'paymentModeType is required' })
        .allow(null, ''),
      paymentModeName: Joi.string()
        .messages({ 'string.base': 'paymentModeName must be a string', 'any.required': 'paymentModeName is required' })
        .allow(null, ''),
      bookIssue: Joi.string()
        .messages({ 'string.base': 'bookIssue must be a string', 'any.required': 'bookIssue is required' })
        .allow(null, ''),
      bookCode: Joi.string()
        .messages({ 'string.base': 'bookCode must be a string', 'any.required': 'bookCode is required' })
        .allow(null, ''),
      ReceiptType: Joi.string()
        .messages({ 'string.base': 'ReceiptType must be a string', 'any.required': 'ReceiptType is required' })
        .allow(null, ''),
      paymentDetails: Joi.string()
        .messages({ 'string.base': 'paymentDetails must be a string', 'any.required': 'paymentDetails is required' })
        .allow(null, ''),
      notes: Joi.string()
        .messages({ 'string.base': 'notes must be a string', 'any.required': 'notes is required' })
        .allow(null, ''),
      isDeleted: Joi.boolean()
        .messages({ 'boolean.base': 'isDeleted must be true or false', 'any.required': 'isDeleted is required' })
        .default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
