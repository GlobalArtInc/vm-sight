const sqlite3 = require('sqlite3').verbose();
console.log(__dirname)
const db = new sqlite3.Database(`./data/base.db`);

export function query(query: string) {
    return new Promise(((resolve, reject) => {
        db.all(query, function(err: any, rows: any) {
            <any>resolve(rows)
        });
    }))
}

export default query