module.exports = ({
router,
ContactpersonController,
ContactpersonValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(ContactpersonValidator.add),
        makeExpressCallback(ContactpersonController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(ContactpersonController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(ContactpersonController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(ContactpersonValidator.update),
        makeExpressCallback(ContactpersonController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(ContactpersonController.delete)
    );

    return router;
};