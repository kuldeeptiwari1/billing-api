const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const InvoiceValidator = require('./invoice.validator');

// service
const InvoiceService = require('./invoice.service');

// controller
const InvoiceController = require('./invoice.controller');

// routes
const routes = require('./invoice.routes')({
    router,
    InvoiceController,
    InvoiceValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    InvoiceController,
    InvoiceService,
    InvoiceRoutes: routes
};