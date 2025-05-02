const auth = require('./auth');
const errorHandler = require('./error-handler');
const authorize = require('./authorize');
const badJsonHandler = require('./validate-json');
const notFoundHandler = require('./not-found-error');
const makeExpressCallback = require('./express-callback');
const makeValidatorCallback = require('./validator-callback');
const sessionChecker = require('./session-checker');
const uploadFile = require('./uploadFile');

module.exports = {
  auth,
  authorize,
  errorHandler,
  badJsonHandler,
  notFoundHandler,
  makeExpressCallback,
  makeValidatorCallback,
  sessionChecker,
  uploadFile
};
