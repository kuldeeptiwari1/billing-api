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
}

module.exports = {
    add: (httpRequest) => {
        const schema = Joi.object(
            {student:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),address:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),dateOfBirth:Joi.date().messages({'date.base': 'must be a valid date', 'any.required': 'is required'}).required(),degree:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),faculty:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),passingYear:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),collegeName:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),course:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),sourceType:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),status:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),notes:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),isDeleted:Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'}).default(false)}
        );
        return schema.validate(httpRequest.body, options);
    },
    update: (httpRequest) => {
        const schema = Joi.object(
             {student:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),address:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),dateOfBirth:Joi.date().messages({'date.base': 'must be a valid date', 'any.required': 'is required'}).required(),degree:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),faculty:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),passingYear:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),collegeName:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),course:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),sourceType:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),status:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),notes:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),isDeleted:Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'}).default(false)}
        );
        return schema.validate(httpRequest.body, options);
    }
}
