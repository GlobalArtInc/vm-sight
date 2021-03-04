const express = require('express');
const path = require('path');
const app = express(), bodyParser = require("body-parser"), router = express.Router();
const init = require('./libs/init')
port = 3601;

const SettingsRoute = require('./routes/settings')
const UsersRoute = require('./routes/users')

// place holder for the data
const users = [];

app.use(bodyParser.json());

app.listen(port, () => {
    console.clear()
    console.log(`Api server listening on port: ${port}`);
    init.createDB(app)
});

SettingsRoute(app)
UsersRoute(app)

app.get('/api/status', (req, res) => {
    res.send({Version: "1.0"})
})

