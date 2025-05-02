const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const ExpenseValidator = require('./expense.validator');

// service
const ExpenseService = require('./expense.service');

// controller
const ExpenseController = require('./expense.controller');

// routes
const routes = require('./expense.routes')({
    router,
    ExpenseController,
    ExpenseValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    ExpenseController,
    ExpenseService,
    ExpenseRoutes: routes
};