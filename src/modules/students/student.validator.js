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
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    email: Joi.string().messages({'string.base': 'email must be a string', 'any.required': 'email is required'}).allow(null, ''),
    phone: Joi.string().messages({'string.base': 'phone must be a string', 'any.required': 'phone is required'}).allow(null, ''),
    gender: Joi.string().messages({'string.base': 'gender must be a string', 'any.required': 'gender is required'}).allow(null, ''),
    dateOfBirth: Joi.date().messages({'date.base': 'dateOfBirth must be a valid date', 'any.required': 'dateOfBirth is required'}).allow(null, ''),
    state: Joi.string().messages({'string.base': 'state must be a string', 'any.required': 'state is required'}).allow(null, ''),
    city: Joi.string().messages({'string.base': 'city must be a string', 'any.required': 'city is required'}).allow(null, ''),
    degreee: Joi.string().messages({'string.base': 'degreee must be a string', 'any.required': 'degreee is required'}).allow(null, ''),
    courseName: Joi.string().messages({'string.base': 'courseName must be a string', 'any.required': 'courseName is required'}).allow(null, ''),
    collegeName: Joi.string().messages({'string.base': 'collegeName must be a string', 'any.required': 'collegeName is required'}).allow(null, ''),
    passingYear: Joi.string().messages({'string.base': 'passingYear must be a string', 'any.required': 'passingYear is required'}).allow(null, ''),
    modeOfClass: Joi.string().messages({'string.base': 'modeOfClass must be a string', 'any.required': 'modeOfClass is required'}).allow(null, ''),
    department: Joi.string().messages({'string.base': 'department must be a string', 'any.required': 'department is required'}).allow(null, ''),
    totalFees: Joi.string().messages({'string.base': 'totalFees must be a string', 'any.required': 'totalFees is required'}).allow(null, ''),
    paidAmount: Joi.string().messages({'string.base': 'paidAmount must be a string', 'any.required': 'paidAmount is required'}).allow(null, ''),
    remainingFees: Joi.string().messages({'string.base': 'remainingFees must be a string', 'any.required': 'remainingFees is required'}).allow(null, ''),
    feesDueDate: Joi.date().messages({'date.base': 'feesDueDate must be a valid date', 'any.required': 'feesDueDate is required'}).allow(null, ''),
    preferredBranch: Joi.string().messages({'string.base': 'preferredBranch must be a string', 'any.required': 'preferredBranch is required'}).allow(null, ''),
    paymentMode: Joi.string().messages({'string.base': 'paymentMode must be a string', 'any.required': 'paymentMode is required'}).allow(null, ''),
    documentType: Joi.string().messages({'string.base': 'documentType must be a string', 'any.required': 'documentType is required'}).allow(null, ''),
    documentNo: Joi.string().messages({'string.base': 'documentNo must be a string', 'any.required': 'documentNo is required'}).allow(null, ''),
    profession: Joi.string().messages({'string.base': 'profession must be a string', 'any.required': 'profession is required'}).allow(null, ''),
    preferredBatch: Joi.string().messages({'string.base': 'preferredBatch must be a string', 'any.required': 'preferredBatch is required'}).allow(null, ''),
    counsellorName: Joi.string().messages({'string.base': 'counsellorName must be a string', 'any.required': 'counsellorName is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
    name: Joi.string().messages({'string.base': 'name must be a string', 'any.required': 'name is required'}).allow(null, ''),
    email: Joi.string().messages({'string.base': 'email must be a string', 'any.required': 'email is required'}).allow(null, ''),
    phone: Joi.string().messages({'string.base': 'phone must be a string', 'any.required': 'phone is required'}).allow(null, ''),
    gender: Joi.string().messages({'string.base': 'gender must be a string', 'any.required': 'gender is required'}).allow(null, ''),
    dateOfBirth: Joi.date().messages({'date.base': 'dateOfBirth must be a valid date', 'any.required': 'dateOfBirth is required'}).allow(null, ''),
    state: Joi.string().messages({'string.base': 'state must be a string', 'any.required': 'state is required'}).allow(null, ''),
    city: Joi.string().messages({'string.base': 'city must be a string', 'any.required': 'city is required'}).allow(null, ''),
    degreee: Joi.string().messages({'string.base': 'degreee must be a string', 'any.required': 'degreee is required'}).allow(null, ''),
    courseName: Joi.string().messages({'string.base': 'courseName must be a string', 'any.required': 'courseName is required'}).allow(null, ''),
    collegeName: Joi.string().messages({'string.base': 'collegeName must be a string', 'any.required': 'collegeName is required'}).allow(null, ''),
    passingYear: Joi.string().messages({'string.base': 'passingYear must be a string', 'any.required': 'passingYear is required'}).allow(null, ''),
    modeOfClass: Joi.string().messages({'string.base': 'modeOfClass must be a string', 'any.required': 'modeOfClass is required'}).allow(null, ''),
    department: Joi.string().messages({'string.base': 'department must be a string', 'any.required': 'department is required'}).allow(null, ''),
    totalFees: Joi.string().messages({'string.base': 'totalFees must be a string', 'any.required': 'totalFees is required'}).allow(null, ''),
    paidAmount: Joi.string().messages({'string.base': 'paidAmount must be a string', 'any.required': 'paidAmount is required'}).allow(null, ''),
    remainingFees: Joi.string().messages({'string.base': 'remainingFees must be a string', 'any.required': 'remainingFees is required'}).allow(null, ''),
    feesDueDate: Joi.date().messages({'date.base': 'feesDueDate must be a valid date', 'any.required': 'feesDueDate is required'}).allow(null, ''),
    preferredBranch: Joi.string().messages({'string.base': 'preferredBranch must be a string', 'any.required': 'preferredBranch is required'}).allow(null, ''),
    paymentMode: Joi.string().messages({'string.base': 'paymentMode must be a string', 'any.required': 'paymentMode is required'}).allow(null, ''),
    documentType: Joi.string().messages({'string.base': 'documentType must be a string', 'any.required': 'documentType is required'}).allow(null, ''),
    documentNo: Joi.string().messages({'string.base': 'documentNo must be a string', 'any.required': 'documentNo is required'}).allow(null, ''),
    profession: Joi.string().messages({'string.base': 'profession must be a string', 'any.required': 'profession is required'}).allow(null, ''),
    preferredBatch: Joi.string().messages({'string.base': 'preferredBatch must be a string', 'any.required': 'preferredBatch is required'}).allow(null, ''),
    counsellorName: Joi.string().messages({'string.base': 'counsellorName must be a string', 'any.required': 'counsellorName is required'}).allow(null, '')
    });
    return schema.validate(httpRequest.body, options);
  }
};
