const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const CourseValidator = require('./course.validator');

// service
const CourseService = require('./course.service');

// controller
const CourseController = require('./course.controller');

// routes
const routes = require('./course.routes')({
    router,
    CourseController,
    CourseValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    CourseController,
    CourseService,
    CourseRoutes: routes
};