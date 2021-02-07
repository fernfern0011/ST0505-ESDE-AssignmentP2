config = require('../config/config');
const pool = require('../config/database')

module.exports.authenticate = (email) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                if (err) throw err;
            } else {
                try {
                    connection.query(`SELECT user.user_id, fullname, email, user_password, role_name, user.role_id  
                   FROM user INNER JOIN role ON user.role_id=role.role_id AND email='${email}'`, {}, (err, rows) => {
                        if (err) {
                            if (err) reject(err);
                        } else {
                            if (rows.length == 1) {
                                console.log(rows);
                                resolve(rows);
                            } else {
                                reject('Login has failed');
                            }
                        }
                        connection.release();
                    });
                } catch (error) {
                    reject(error);;
                }
            }
        }); //End of getConnection
    })
} //End of authenticate