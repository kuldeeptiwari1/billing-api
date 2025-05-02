const router = require('express').Router();

const {
  makeExpressCallback,
  makeValidatorCallback,
  sessionChecker
} = require('../../middlewares');

// validator
const AuthValidator = require('./auth.validator');

// service
const AuthService = require('./auth.service');

// controller
const AuthController = require('./auth.controller');

// routes
const routes = require('./auth.routes')({
  router,
  AuthController,
  AuthValidator,
  makeValidatorCallback,
  makeExpressCallback,
  sessionChecker
});


module.exports = {
  AuthController,
  AuthService,
  AuthRoutes: routes
};
