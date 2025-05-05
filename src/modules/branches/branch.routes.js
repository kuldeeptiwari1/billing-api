module.exports = ({
router,
BranchController,
BranchValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(BranchValidator.add),
        makeExpressCallback(BranchController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(BranchController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(BranchController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(BranchValidator.update),
        makeExpressCallback(BranchController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(BranchController.delete)
    );

    return router;
};