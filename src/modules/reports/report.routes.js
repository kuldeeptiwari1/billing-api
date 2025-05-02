module.exports = ({
router,
ReportController,
ReportValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(ReportValidator.add),
        makeExpressCallback(ReportController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(ReportController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(ReportController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(ReportValidator.update),
        makeExpressCallback(ReportController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(ReportController.delete)
    );

    return router;
};