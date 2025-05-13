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
    invoiceNo: Joi.string().messages({'string.base': 'invoiceNo must be a string', 'any.required': 'invoiceNo is required'}).allow(null, ''),
    studentName: Joi.string().messages({'string.base': 'studentName must be a string', 'any.required': 'studentName is required'}).allow(null, ''),
    studentId: Joi.string().messages({'string.base': 'studentId must be a string', 'any.required': 'studentId is required'}).allow(null, ''),
    issueDate: Joi.date().messages({'date.base': 'issueDate must be a valid date', 'any.required': 'issueDate is required'}).allow(null, ''),
    taxPercentage: Joi.string().messages({'string.base': 'taxPercentage must be a string', 'any.required': 'taxPercentage is required'}).required(),
    discount: Joi.string().messages({'string.base': 'discount must be a string', 'any.required': 'discount is required'}).required(),
    totalPrice: Joi.string().messages({'string.base': 'totalPrice must be a string', 'any.required': 'totalPrice is required'}).allow(null, ''),
    couresAmount: Joi.string().messages({'string.base': 'couresAmount must be a string', 'any.required': 'couresAmount is required'}).allow(null, ''),
    totalDiscount: Joi.string().messages({'string.base': 'totalDiscount must be a string', 'any.required': 'totalDiscount is required'}).allow(null, ''),
    subTotal: Joi.string().messages({'string.base': 'subTotal must be a string', 'any.required': 'subTotal is required'}).allow(null, ''),
    totalTaxes: Joi.string().messages({'string.base': 'totalTaxes must be a string', 'any.required': 'totalTaxes is required'}).allow(null, ''),
    finalAmount: Joi.string().messages({'string.base': 'finalAmount must be a string', 'any.required': 'finalAmount is required'}).allow(null, ''),
    isDeleted: Joi.boolean().messages({'boolean.base': 'isDeleted must be true or false', 'any.required': 'isDeleted is required'}).default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
    invoiceNo: Joi.string().messages({'string.base': 'invoiceNo must be a string', 'any.required': 'invoiceNo is required'}).allow(null, ''),
    studentName: Joi.string().messages({'string.base': 'studentName must be a string', 'any.required': 'studentName is required'}).allow(null, ''),
    studentId: Joi.string().messages({'string.base': 'studentId must be a string', 'any.required': 'studentId is required'}).allow(null, ''),
    issueDate: Joi.date().messages({'date.base': 'issueDate must be a valid date', 'any.required': 'issueDate is required'}).allow(null, ''),
    taxPercentage: Joi.string().messages({'string.base': 'taxPercentage must be a string', 'any.required': 'taxPercentage is required'}).required(),
    discount: Joi.string().messages({'string.base': 'discount must be a string', 'any.required': 'discount is required'}).required(),
    totalPrice: Joi.string().messages({'string.base': 'totalPrice must be a string', 'any.required': 'totalPrice is required'}).allow(null, ''),
    couresAmount: Joi.string().messages({'string.base': 'couresAmount must be a string', 'any.required': 'couresAmount is required'}).allow(null, ''),
    totalDiscount: Joi.string().messages({'string.base': 'totalDiscount must be a string', 'any.required': 'totalDiscount is required'}).allow(null, ''),
    subTotal: Joi.string().messages({'string.base': 'subTotal must be a string', 'any.required': 'subTotal is required'}).allow(null, ''),
    totalTaxes: Joi.string().messages({'string.base': 'totalTaxes must be a string', 'any.required': 'totalTaxes is required'}).allow(null, ''),
    finalAmount: Joi.string().messages({'string.base': 'finalAmount must be a string', 'any.required': 'finalAmount is required'}).allow(null, ''),
    isDeleted: Joi.boolean().messages({'boolean.base': 'isDeleted must be true or false', 'any.required': 'isDeleted is required'}).default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
