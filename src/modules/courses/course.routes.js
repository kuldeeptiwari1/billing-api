module.exports = ({
router,
CourseController,
CourseValidator,
makeValidatorCallback,
makeExpressCallback,
sessionChecker
}) => {
    router.post('/', 
        sessionChecker, 
        makeValidatorCallback(CourseValidator.add),
        makeExpressCallback(CourseController.add)
    );

    router.get('/',
        sessionChecker,
        makeExpressCallback(CourseController.list)
    );

    router.get('/:id', 
        sessionChecker,
        makeExpressCallback(CourseController.view)
    );

    router.put('/:id', 
        sessionChecker,
        makeValidatorCallback(CourseValidator.update),
        makeExpressCallback(CourseController.update)
    );

    router.delete('/:id',
        sessionChecker,
        makeExpressCallback(CourseController.delete)
    );

    return router;
};