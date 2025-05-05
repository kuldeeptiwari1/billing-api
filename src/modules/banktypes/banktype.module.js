const router = require('express').Router();

const {
makeExpressCallback,
makeValidatorCallback,
sessionChecker
} = require('../../middlewares');

// validator
const BanktypeValidator = require('./banktype.validator');

// service
const BanktypeService = require('./banktype.service');

// controller
const BanktypeController = require('./banktype.controller');

// routes
const routes = require('./banktype.routes')({
    router,
    BanktypeController,
    BanktypeValidator,
    makeValidatorCallback,
    makeExpressCallback,
    sessionChecker
});

module.exports = {
    BanktypeController,
    BanktypeService,
    BanktypeRoutes: routes
};