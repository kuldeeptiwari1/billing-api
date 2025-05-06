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
      gender: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      courseName: Joi.string().required(),
      contactPerson: Joi.string().required(),
      modeOfClass: Joi.string().required(),
      department: Joi.string().required(),
      totalFees: Joi.string().required(),
      paidAmount: Joi.string().required(),
      remainingFees: Joi.string().required(),
      dueDate: Joi.date().required(),
      preferredBranch: Joi.string().required(),
      paymentType: Joi.string().required(),
      documentType: Joi.string().required(),
      documentNo: Joi.string().required(),
      profession: Joi.string().required(),
      preferredBatch: Joi.string().required(),
      counsellorName: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      gender: Joi.string().required(),
      state: Joi.string().required(),
      city: Joi.string().required(),
      courseName: Joi.string().required(),
      contactPerson: Joi.string().required(),
      modeOfClass: Joi.string().required(),
      department: Joi.string().required(),
      totalFees: Joi.string().required(),
      paidAmount: Joi.string().required(),
      remainingFees: Joi.string().required(),
      dueDate: Joi.date().required(),
      preferredBranch: Joi.string().required(),
      paymentType: Joi.string().required(),
      documentType: Joi.string().required(),
      documentNo: Joi.string().required(),
      profession: Joi.string().required(),
      preferredBatch: Joi.string().required(),
      counsellorName: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
