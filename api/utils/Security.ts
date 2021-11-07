const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

export function cryptPassword(password) {
    return new Promise((resolve, reject) => {
        return bcrypt.genSalt(10, function (err, salt) {
            if (err)
                return reject(err);

            return bcrypt.hash(password, salt, function (err, hash) {
                return resolve(hash);
            });
        });
    })
}

export function comparePassword(plainPass, hash, callback) {
    bcrypt.compare(plainPass, hash, (err, isPasswordMatch) => {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
}

export function getGUID() {
    return uuidv4();
}