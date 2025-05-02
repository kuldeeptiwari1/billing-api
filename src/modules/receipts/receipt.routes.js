module.exports = ({
router,
ReceiptController,
ReceiptValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(ReceiptValidator.add),
        makeExpressCallback(ReceiptController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(ReceiptController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(ReceiptController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(ReceiptValidator.update),
        makeExpressCallback(ReceiptController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(ReceiptController.delete)
    );

    return router;
};