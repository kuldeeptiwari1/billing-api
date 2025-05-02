const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const RoleValidator = require('./role.validator');

// service
const RoleService = require('./role.service');

// controller
const RoleController = require('./role.controller');

// routes
const routes = require('./role.routes')({
    router,
    RoleController,
    RoleValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    RoleController,
    RoleService,
    RoleRoutes: routes
};