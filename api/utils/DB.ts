const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(global.data + `/base.db`);

export function dbQuery(query: string) {
    return new Promise(((resolve, reject) => {
        db.all(query, function(err: any, rows: any) {
            resolve(rows)
        });
    }))
}