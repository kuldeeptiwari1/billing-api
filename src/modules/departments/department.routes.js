module.exports = ({
router,
DepartmentController,
DepartmentValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(DepartmentValidator.add),
        makeExpressCallback(DepartmentController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(DepartmentController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(DepartmentController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(DepartmentValidator.update),
        makeExpressCallback(DepartmentController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(DepartmentController.delete)
    );

    return router;
};