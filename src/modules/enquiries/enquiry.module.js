const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const EnquiryValidator = require('./enquiry.validator');

// service
const EnquiryService = require('./enquiry.service');

// controller
const EnquiryController = require('./enquiry.controller');

// routes
const routes = require('./enquiry.routes')({
    router,
    EnquiryController,
    EnquiryValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    EnquiryController,
    EnquiryService,
    EnquiryRoutes: routes
};