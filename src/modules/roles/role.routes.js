module.exports = ({
router,
RoleController,
RoleValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(RoleValidator.add),
        makeExpressCallback(RoleController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(RoleController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(RoleController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(RoleValidator.update),
        makeExpressCallback(RoleController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(RoleController.delete)
    );

    return router;
};