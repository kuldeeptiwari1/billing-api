module.exports = ({
router,
StudentController,
StudentValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(StudentValidator.add),
        makeExpressCallback(StudentController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(StudentController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(StudentController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(StudentValidator.update),
        makeExpressCallback(StudentController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(StudentController.delete)
    );

    return router;
};