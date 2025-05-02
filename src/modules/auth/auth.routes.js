module.exports = ({ router, AuthController, AuthValidator, makeValidatorCallback, makeExpressCallback }) => {
  // Public routes
  router.post('/login', makeExpressCallback(AuthController.login));
  router.post('/refreshlogin', makeExpressCallback(AuthController.refreshLogin));
  router.post('/login-sso', makeExpressCallback(AuthController.loginUsingAccessToken));
  router.post('/register', makeExpressCallback(AuthController.register));
  router.post('/getprofilebytoken',makeExpressCallback(AuthController.getProfileByToken))

  router.post(
    '/reset',
    makeValidatorCallback(AuthValidator.validateReset),
    makeExpressCallback(AuthController.resetPassword)
  );

  router.get('/logout', makeExpressCallback(AuthController.logout));
  router.get('/me', makeExpressCallback(AuthController.authMe));

  return router;
};
