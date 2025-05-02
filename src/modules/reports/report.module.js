const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const ReportValidator = require('./report.validator');

// service
const ReportService = require('./report.service');

// controller
const ReportController = require('./report.controller');

// routes
const routes = require('./report.routes')({
    router,
    ReportController,
    ReportValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    ReportController,
    ReportService,
    ReportRoutes: routes
};