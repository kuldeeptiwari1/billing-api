const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const ContactpersonValidator = require('./contactperson.validator');

// service
const ContactpersonService = require('./contactperson.service');

// controller
const ContactpersonController = require('./contactperson.controller');

// routes
const routes = require('./contactperson.routes')({
    router,
    ContactpersonController,
    ContactpersonValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    ContactpersonController,
    ContactpersonService,
    ContactpersonRoutes: routes
};