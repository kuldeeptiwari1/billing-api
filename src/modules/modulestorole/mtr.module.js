const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const MtrValidator = require('./mtr.validator');

// service
const MtrService = require('./mtr.service');

// controller
const MtrController = require('./mtr.controller');

// routes
const routes = require('./mtr.routes')({
    router,
    MtrController,
    MtrValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    MtrController,
    MtrService,
    MtrRoutes: routes
};