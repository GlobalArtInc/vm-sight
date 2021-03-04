const db = require('../../class/db')

module.exports = (app) => {

    app.route('/api/users/admin/init')
        .get((req, res) => res.status(405).send({response: false}))
        .post((req, res) => {
            db.query('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
                if (r[0].count === 0) {
                    const body = req.body;
                    if (body.Username && body.Password) {
                        return res.send({response: true})
                    } else {
                        return res.status(405).send({response: false})
                    }
                } else {
                    return res.status(403).send({response: false})
                }
            })
        })

    app.get('/api/users/admin/check', (req, res) => {
        db.query('SELECT COUNT(*) as count FROM users WHERE role = 1').then((r) => {
            if (r[0].count > 0) {
                return res.send({response: true})
            } else {
                return res.status(404).send({
                    "message": "No administrator account found inside the database",
                    "details": "Object not found inside the database"
                })
            }
        })
    })
}