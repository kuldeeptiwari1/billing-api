module.exports = ({
router,
BankController,
BankValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(BankValidator.add),
        makeExpressCallback(BankController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(BankController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(BankController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(BankValidator.update),
        makeExpressCallback(BankController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(BankController.delete)
    );

    return router;
};