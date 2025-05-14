const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const BankValidator = require('./bank.validator');

// service
const BankService = require('./bank.service');

// controller
const BankController = require('./bank.controller');

// routes
const routes = require('./bank.routes')({
    router,
    BankController,
    BankValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    BankController,
    BankService,
    BankRoutes: routes
};