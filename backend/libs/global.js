const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

module.exports.cryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        return bcrypt.genSalt(10, function(err, salt) {
            if (err)
                return reject(err);

            return bcrypt.hash(password, salt, function(err, hash) {
                return resolve(hash);
            });
        });
    })
};


module.exports.comparePassword = function(plainPass, hashword, callback) {
    bcrypt.compare(plainPass, hashword, function(err, isPasswordMatch) {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};

module.exports.getGUID = () => {
    return uuidv4();
}