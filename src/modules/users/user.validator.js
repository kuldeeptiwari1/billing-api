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
    email: Joi.string().messages({'string.base': 'email must be a string', 'any.required': 'email is required'}).allow(null, ''),
    roles: Joi.string().messages({'string.base': 'roles must be a string', 'any.required': 'roles is required'}).required(),
    password: Joi.string().messages({'string.base': 'password must be a string', 'any.required': 'password is required'}).allow(null, ''),
    isDeleted: Joi.boolean().messages({'boolean.base': 'isDeleted must be true or false', 'any.required': 'isDeleted is required'}).default(false),
    employeeId: Joi.string().messages({'string.base': 'employeeId must be a string', 'any.required': 'employeeId is required'}).default(0).required(),
    managerEmail: Joi.string().messages({'string.base': 'managerEmail must be a string', 'any.required': 'managerEmail is required'}).required(),
    manager: Joi.string().messages({'string.base': 'manager must be a string', 'any.required': 'manager is required'}).required(),
    displayName: Joi.string().messages({'string.base': 'displayName must be a string', 'any.required': 'displayName is required'}).allow(null, ''),
    isSuperAdmin: Joi.boolean().messages({'boolean.base': 'isSuperAdmin must be true or false', 'any.required': 'isSuperAdmin is required'}).default(false).required()
    });
    return schema.validate(httpRequest.body, options);
  },
  update: (httpRequest) => {
    const schema = Joi.object({
    email: Joi.string().messages({'string.base': 'email must be a string', 'any.required': 'email is required'}).allow(null, ''),
    roles: Joi.string().messages({'string.base': 'roles must be a string', 'any.required': 'roles is required'}).required(),
    password: Joi.string().messages({'string.base': 'password must be a string', 'any.required': 'password is required'}).allow(null, ''),
    isDeleted: Joi.boolean().messages({'boolean.base': 'isDeleted must be true or false', 'any.required': 'isDeleted is required'}).default(false),
    employeeId: Joi.string().messages({'string.base': 'employeeId must be a string', 'any.required': 'employeeId is required'}).default(0).required(),
    managerEmail: Joi.string().messages({'string.base': 'managerEmail must be a string', 'any.required': 'managerEmail is required'}).required(),
    manager: Joi.string().messages({'string.base': 'manager must be a string', 'any.required': 'manager is required'}).required(),
    displayName: Joi.string().messages({'string.base': 'displayName must be a string', 'any.required': 'displayName is required'}).allow(null, ''),
    isSuperAdmin: Joi.boolean().messages({'boolean.base': 'isSuperAdmin must be true or false', 'any.required': 'isSuperAdmin is required'}).default(false).required()
    });
    return schema.validate(httpRequest.body, options);
  }
};
