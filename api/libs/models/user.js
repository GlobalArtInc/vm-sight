const db = require('../db');
const global = require('../global')

module.exports.getUserById = (id) => {
    return db.query(`SELECT * FROM users WHERE id = '${id}'`).then((user) => {
        if (user.length > 0) {
            return user[0]
        } else {
            return false
        }
    })
}

module.exports.getUserByIdAndCheckIfAdmin = (id) => {
    return this.getUserById(id).then((user) => {
        if(user.role === 1) {
            return true
        } else {
            return false
        }
    })
}

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