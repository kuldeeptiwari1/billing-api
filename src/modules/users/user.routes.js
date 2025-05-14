module.exports = ({
router,
UserController,
UserValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(UserValidator.add),
        makeExpressCallback(UserController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(UserController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(UserController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(UserValidator.update),
        makeExpressCallback(UserController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(UserController.delete)
    );

    return router;
};