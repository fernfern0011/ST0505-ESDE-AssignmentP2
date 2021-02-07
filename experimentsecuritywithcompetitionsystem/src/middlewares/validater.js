// validating email and password
exports.validateEmailPassword = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    // validate for email
    let emailRegex = /\S+@\S+\.\S+/;
    // validate for password-min 8 char, > 1 uppercase letter, 1 lowercase letter, 1 number & 1 special character
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
 
    if (emailRegex.test(email) && passwordRegex.test(password)) {
        next();
    } else {
        console.log("Invalid email or password.")
        return res.status(500).json({ message: 'Invalid email or password.' });
    }
    
}; //End of validateEmailPassword