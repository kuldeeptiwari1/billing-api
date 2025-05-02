const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const ReceiptValidator = require('./receipt.validator');

// service
const ReceiptService = require('./receipt.service');

// controller
const ReceiptController = require('./receipt.controller');

// routes
const routes = require('./receipt.routes')({
    router,
    ReceiptController,
    ReceiptValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    ReceiptController,
    ReceiptService,
    ReceiptRoutes: routes
};