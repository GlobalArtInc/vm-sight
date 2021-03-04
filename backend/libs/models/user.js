const db = require('../db');
const global = require('../global')

module.exports.findUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE username = '${username}'`).then((user) => {
            if (user.length > 0) {
                global.comparePassword(password, user[0].password, (err, isMatch) => {
                    if (isMatch) {
                        resolve(user[0])
                    } else {
                        reject()
                    }
                })
            }
        })
    })
    //db.que
}