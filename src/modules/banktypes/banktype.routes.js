module.exports = ({
router,
BanktypeController,
BanktypeValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(BanktypeValidator.add),
        makeExpressCallback(BanktypeController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(BanktypeController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(BanktypeController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(BanktypeValidator.update),
        makeExpressCallback(BanktypeController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(BanktypeController.delete)
    );

    return router;
};