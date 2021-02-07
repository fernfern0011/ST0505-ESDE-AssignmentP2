module.exports.getClientUserId = (req, res, next) => {
    console.log('http header - user ', req.headers['user']);
    req.body.userId = req.headers['user'];
    console.log('Inspect user id which is planted inside the request header : ', req.body.userId);
    if (req.body.userId != null) {
        next()
        return;
    } else {

        var jsonResult = {
            success: false,
            message: 'Unauthorized access',
            error_code: 403,
            data: {}
        }

        res.status(403).json(jsonResult);
        return;
    }

} //End of getClientUserId