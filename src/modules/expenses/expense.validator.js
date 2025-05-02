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
            {date:Joi.date().messages({'date.base': 'must be a valid date', 'any.required': 'is required'}).required(),cashExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),bankExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),paytmExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),cashAmount:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),bankAmount:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),paytmAmount:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),networking:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),development:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),softskill:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),banking:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),placementNetworking:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),cad:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),total:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),totalExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),totalCashback:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),grandTotal:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),isDeleted:Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'}).default(false)}
        );
        return schema.validate(httpRequest.body, options);
    },
    update: (httpRequest) => {
        const schema = Joi.object(
             {date:Joi.date().messages({'date.base': 'must be a valid date', 'any.required': 'is required'}).required(),cashExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),bankExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),paytmExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),cashAmount:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),bankAmount:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),paytmAmount:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),networking:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),development:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),softskill:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),banking:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),placementNetworking:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),cad:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),total:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),totalExpense:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),totalCashback:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),grandTotal:Joi.string().messages({'string.base': 'must be a string', 'any.required': 'is required'}).required(),isDeleted:Joi.boolean().messages({'boolean.base': 'must be true or false', 'any.required': 'is required'}).default(false)}
        );
        return schema.validate(httpRequest.body, options);
    }
}
