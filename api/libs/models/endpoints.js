const db = require('../db')

module.exports.getEndpoint = (id) => {
    return db.query(`SELECT * FROM endpoints WHERE id = '${id}'`).then((endpoint) => {
        if (endpoint.length > 0) {
            return endpoint[0];
        } else {
            return false;
        }
    })
}

module.exports.checkAccess = (id) => {
    return true;
}