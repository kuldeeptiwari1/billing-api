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
            {name:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),email:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),phone:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),designation:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),password:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),isDeleted:Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'}).default(false)}
        );
        return schema.validate(httpRequest.body, options);
    },
    update: (httpRequest) => {
        const schema = Joi.object(
             {name:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),email:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),phone:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),designation:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),password:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),isDeleted:Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'}).default(false)}
        );
        return schema.validate(httpRequest.body, options);
    }
}
