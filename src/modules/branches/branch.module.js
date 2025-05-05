const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const BranchValidator = require('./branch.validator');

// service
const BranchService = require('./branch.service');

// controller
const BranchController = require('./branch.controller');

// routes
const routes = require('./branch.routes')({
    router,
    BranchController,
    BranchValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    BranchController,
    BranchService,
    BranchRoutes: routes
};