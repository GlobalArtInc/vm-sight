const sqlite3 = require('sqlite3').verbose();
console.log(__dirname)
const db = new sqlite3.Database(`${global.data}/base.db`);

module.exports.query = (query) => {
    return new Promise(((resolve, reject) => {
        db.all(query, function(err, rows) {
            resolve(rows)
        });
    }))
}