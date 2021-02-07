const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
var logger = require('../helpers/logger')

exports.processLogin = async (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    try {
        const user = await auth.authenticate(email)
        console.log('login')
        if (user.length == 1) {
            if ((password == null) || (user[0] == null)) {
                var jsonResult = {
                    success: false,
                    message: "Login failed",
                    error_code: 500,
                    data: {},
                };
                console.log('login fail')

                logger.error({path: req.originalUrl, method: req.method, ipaddr: req.ip, message: jsonResult})
                return res.status(500).json(jsonResult);
            }
            if (bcrypt.compareSync(password, user[0].user_password) == true) {

                let jsonResult = {
                    success: true,
                    message: "Successfully Logging in",
                    data: {
                        user_id: user[0].user_id,
                        role_name: user[0].role_name,
                        token: jwt.sign({ id: user[0].user_id }, config.JWTKey, {
                            expiresIn: 7200, //Expires in 2 hrs
                        })
                    }
                }; //End of data variable setup

                return res.status(200).json(jsonResult);
            } else {
                //when password is wrong
                var jsonResult = {
                    success: false,
                    message: "Login failed",
                    error_code: 500,
                    data: {},
                };
                console.log('login fail')
                logger.error({path: req.originalUrl, method: req.method, ipaddr: req.ip, message: jsonResult, user_id: user[0].user_id})
                return res.status(500).json(jsonResult);
            } //End of password comparison with the retrieved decoded password.
        } //End of checking if there are returned SQL results

    } catch (error) { 
        var jsonResult = {
            'success': false,
            'message': 'Credentials are not valid.',
            'error_code': '500',
            'data': {}
        }
        console.log('cred')
        logger.error({path: req.originalUrl, method: req.method, ipaddr: req.ip, message: jsonResult})
        return res.status(500).json(jsonResult);
    } //end of try
};

// If user submitted data, run the code in below
exports.processRegister = (req, res, next) => {
    console.log('processRegister running');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;

    bcrypt.hash(password, 10, async(err, hash) => {
        if (err) {
            console.log('Error on hashing password');
            return res.status(500).json({ message: 'Unable to complete registration' });
        } else {
            try {
                results = await user.createUser(fullName, email, hash);
                console.log(results);
                return res.status(200).json({ message: 'Completed registration' });
            } catch (error) {
                console.log('processRegister method : catch block section code is running');
                console.log(error, '=======================================================================');
                return res.status(500).json({ message: 'Unable to complete registration' });
            }
        }
    });


}; //End of processRegister