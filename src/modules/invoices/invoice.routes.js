module.exports = ({
router,
InvoiceController,
InvoiceValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(InvoiceValidator.add),
        makeExpressCallback(InvoiceController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(InvoiceController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(InvoiceController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(InvoiceValidator.update),
        makeExpressCallback(InvoiceController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(InvoiceController.delete)
    );

    return router;
};