const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const ModeofpaymentValidator = require('./modeofpayment.validator');

// service
const ModeofpaymentService = require('./modeofpayment.service');

// controller
const ModeofpaymentController = require('./modeofpayment.controller');

// routes
const routes = require('./modeofpayment.routes')({
    router,
    ModeofpaymentController,
    ModeofpaymentValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    ModeofpaymentController,
    ModeofpaymentService,
    ModeofpaymentRoutes: routes
};