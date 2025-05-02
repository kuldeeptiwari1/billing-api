module.exports = ({
router,
ExpenseController,
ExpenseValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(ExpenseValidator.add),
        makeExpressCallback(ExpenseController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(ExpenseController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(ExpenseController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(ExpenseValidator.update),
        makeExpressCallback(ExpenseController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(ExpenseController.delete)
    );

    return router;
};