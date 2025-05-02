module.exports = ({
router,
MtrController,
MtrValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(MtrValidator.add),
        makeExpressCallback(MtrController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(MtrController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(MtrController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(MtrValidator.update),
        makeExpressCallback(MtrController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(MtrController.delete)
    );

    return router;
};