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
      studentName: Joi.string().required(),
      status: Joi.string().required(),
      issueDate: Joi.string().required(),
      course: Joi.string().required(),
      taxPercentage: Joi.string().required(),
      discount: Joi.string().required(),
      totalPrice: Joi.string().required(),
      baseAmount: Joi.string().required(),
      totalDiscount: Joi.string().required(),
      subtotal: Joi.string().required(),
      totalTaxes: Joi.string().required(),
      finalAmount: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },

  update: (httpRequest) => {
    const schema = Joi.object({
      studentName: Joi.string().required(),
      status: Joi.string().required(),
      issueDate: Joi.string().required(),
      course: Joi.string().required(),
      taxPercentage: Joi.string().required(),
      discount: Joi.string().required(),
      totalPrice: Joi.string().required(),
      baseAmount: Joi.string().required(),
      totalDiscount: Joi.string().required(),
      subtotal: Joi.string().required(),
      totalTaxes: Joi.string().required(),
      finalAmount: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
