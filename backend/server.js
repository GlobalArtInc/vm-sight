const express = require('express');
const path = require('path');
const app = express(), bodyParser = require("body-parser"), router = express.Router();
const init = require('./class/init')
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

app.get('/api/users', (req, res) => {
    console.log('api/users called!!!!!!!')
    res.json(users);
});

app.post('/api/user', (req, res) => {
    const user = req.body.user;
    console.log('Adding user:::::', user);
    users.push(user);
    res.json("user addedd");
});

app.get('/api', (req,res) => {
    return res.send({response: false})
});