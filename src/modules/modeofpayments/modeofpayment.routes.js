module.exports = ({
router,
ModeofpaymentController,
ModeofpaymentValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(ModeofpaymentValidator.add),
        makeExpressCallback(ModeofpaymentController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(ModeofpaymentController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(ModeofpaymentController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(ModeofpaymentValidator.update),
        makeExpressCallback(ModeofpaymentController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(ModeofpaymentController.delete)
    );

    return router;
};