const { NotFoundError } = require('../utils/api-errors');

/**
 *
 * @param req
 * @param res
 */
module.exports = (req, _res,next) => {
  const errorMessage = `Not Found: ${req.method} on ${req.url}`;
  console.log("Error", errorMessage);
  next()
  //throw new NotFoundError(errorMessage);
};
