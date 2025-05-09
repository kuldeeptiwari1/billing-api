const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const DepartmentValidator = require('./department.validator');

// service
const DepartmentService = require('./department.service');

// controller
const DepartmentController = require('./department.controller');

// routes
const routes = require('./department.routes')({
    router,
    DepartmentController,
    DepartmentValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    DepartmentController,
    DepartmentService,
    DepartmentRoutes: routes
};