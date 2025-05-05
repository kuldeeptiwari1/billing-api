module.exports = ({
router,
EnquiryController,
EnquiryValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(EnquiryValidator.add),
        makeExpressCallback(EnquiryController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(EnquiryController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(EnquiryController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(EnquiryValidator.update),
        makeExpressCallback(EnquiryController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(EnquiryController.delete)
    );

    return router;
};