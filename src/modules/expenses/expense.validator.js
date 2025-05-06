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
      date: Joi.date().required(),
      cashExpense: Joi.string().required(),
      bankExpense: Joi.string().required(),
      paytmExpense: Joi.string().required(),
      cashAmount: Joi.string().required(),
      bankAmount: Joi.string().required(),
      paytmAmount: Joi.string().required(),
      networking: Joi.string().required(),
      development: Joi.string().required(),
      softskill: Joi.strin.required(),
      banking: Joi.strin.required(),
      placementNetworking: Joi.string().required(),
      cad: Joi.strin.required(),
      total: Joi.strin.required(),
      totalExpense: Joi.string().required(),
      totalCashback: Joi.string().required(),
      grandTotal: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      date: Joi.date().required(),
      cashExpense: Joi.string().required(),
      bankExpense: Joi.string().required(),
      paytmExpense: Joi.string().required(),
      cashAmount: Joi.string().required(),
      bankAmount: Joi.string().required(),
      paytmAmount: Joi.string().required(),
      networking: Joi.string().required(),
      development: Joi.string().required(),
      softskill: Joi.string().required(),
      banking: Joi.string().required(),
      placementNetworking: Joi.string().required(),
      cad: Joi.string().required(),
      total: Joi.string().required(),
      totalExpense: Joi.string().required(),
      totalCashback: Joi.string().required(),
      grandTotal: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
