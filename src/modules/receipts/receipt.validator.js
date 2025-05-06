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
      receiptDate: Joi.date().required(),
      studentName: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().required(),
      course: Joi.string().required(),
      totalAmount: Joi.string().required(),
      paidReceiptAmount: Joi.string().required(),
      paidAmount: Joi.string().required(),
      remainingAmount: Joi.string().required(),
      fineAmount: Joi.string().required(),
      selectSeries: Joi.string().required(),
      contactPerson1: Joi.string().required(),
      contactPersonNo1: Joi.string().required(),
      contactPersonEmail1: Joi.string().required(),
      contactPerson2: Joi.string().required(),
      contactPersonNo2: Joi.string().required(),
      contactPersonEmail2: Joi.string().required(),
      paymentMode: Joi.string().required(),
      bankType: Joi.string().required(),
      paytmAccount: Joi.string().required(),
      feesDueDate: Joi.date().required(),
      bookIssue: Joi.string().required(),
      bookCode: Joi.string().required(),
      ReceiptType: Joi.string().required(),
      paymentDetails: Joi.string().required(),
      dueDate: Joi.date().required(),
      notes: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
      receiptDate: Joi.date().required(),
      studentName: Joi.string().required(),
      phone: Joi.string().required(),
      email: Joi.string().required(),
      course: Joi.string().required(),
      totalAmount: Joi.string().required(),
      paidReceiptAmount: Joi.string().required(),
      paidAmount: Joi.string().required(),
      remainingAmount: Joi.string().required(),
      fineAmount: Joi.string().required(),
      selectSeries: Joi.string().required(),
      contactPerson1: Joi.string().required(),
      contactPersonNo1: Joi.string().required(),
      contactPersonEmail1: Joi.string().required(),
      contactPerson2: Joi.string().required(),
      contactPersonNo2: Joi.string().required(),
      contactPersonEmail2: Joi.string().required(),
      paymentMode: Joi.string().required(),
      bankType: Joi.string().required(),
      paytmAccount: Joi.string().required(),
      feesDueDate: Joi.date().required(),
      bookIssue: Joi.string().required(),
      bookCode: Joi.string().required(),
      ReceiptType: Joi.string().required(),
      paymentDetails: Joi.string().required(),
      dueDate: Joi.date().required(),
      notes: Joi.string().required(),
      isDeleted: Joi.boolean().default(false)
    });
    return schema.validate(httpRequest.body, options);
  }
};
