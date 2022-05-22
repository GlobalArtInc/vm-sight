const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

export async function cryptPassword(password) {
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

export async function comparePassword(plainPass, hash) {
    return bcrypt.compare(plainPass, hash);
}

export function getGUID() {
    return uuidv4();
}
