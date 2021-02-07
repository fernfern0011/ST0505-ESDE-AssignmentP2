// Import controlers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const checkUserFn = require('./middlewares/checkUserFn');
const validater = require('./middlewares/validater');
// Match URL's with controllers
exports.appRoute = router => {

    router.post('/api/user/login', authController.processLogin);
    router.post('/api/user/register', validater.validateEmailPassword, authController.processRegister);
    router.post('/api/user/process-submission', checkUserFn.getClientUserId, userController.processDesignSubmission);
    router.put('/api/user/', function verifyAdmin(req, res, next) {
        console.log(req.headers['user']);
        console.log(req.headers['rolename']);

        req.body.userId = req.headers['user'];
        req.body.rolename = req.headers['rolename'];

        if (req.body.rolename === 'admin' && req.body.userId != null) {
            next()
            return;
        } else {
            console.log('Unauthorized access. Cannot update user.');
            res.status(403).json({ message: 'Unauthorized access. Cannot update user.' });
            return;
        }
    }, userController.processUpdateOneUser);
    router.put('/api/user/design/', userController.processUpdateOneDesign);

    router.get('/api/user/process-search-design/:pagenumber/:search?', checkUserFn.getClientUserId, userController.processGetSubmissionData);
    router.get('/api/user/process-search-user/:pagenumber/:search?',
        function verifyAdmin(req, res, next) {
            console.log(req.headers['user']);
            console.log(req.headers['rolename']);

            req.body.userId = req.headers['user'];
            req.body.rolename = req.headers['rolename'];

            if (req.body.rolename === 'admin' && req.body.userId != null) {
                next()
                return;
            } else {
                console.log('Unauthorized access. Cannot search for users.');
                res.status(403).json({ message: 'Unauthorized access. Cannot search for users.' });
                return;
            }
        }, userController.processGetUserData);

    router.get('/api/user/:recordId',
    function verifyAdmin(req, res, next) {
        console.log(req.headers['user']);
        console.log(req.headers['rolename']);

        req.body.userId = req.headers['user'];
        req.body.rolename = req.headers['rolename'];

        if (req.body.rolename === 'admin' && req.body.userId != null) {
            next()
            return;
        } else {
            console.log('Unauthorized access. Cannot retrieve user data.');
            res.status(403).json({ message: 'Unauthorized access. Cannot retrieve user data.' });
            return;
        }
    }, userController.processGetOneUserData);
    router.get('/api/user/profile/:recordId', userController.processGetOneUserData);
    router.get('/api/user/design/:fileId', userController.processGetOneDesignData);
};

