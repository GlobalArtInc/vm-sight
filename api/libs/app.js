var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
const path = require('path');

var log = require('./log')(module);

const api = require('./routes/api');
const upload = require('./routes/upload');
const auth = require('./routes/auth')
const settings = require('./routes/settings')
const users = require('./routes/users')
const endpoints = require('./routes/endpoints')
const init = require('./init')
const fs = require('fs')

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

init.generateKeys()

const key = fs.readFileSync(`${global.data}/vm-sight.pem`)
app.set('jwt-secret', key)

if (global.env === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));
}

require('express-ws')(app);

app.get('/api/ws/exec', function(req, res, next){
    res.end();
});

const dockerService = require('./services/docker')

app.ws('/api/ws/exec', function(ws, req) {
    const {token, endpoint, id} = req.query
    ws.on('message', function(msg) {
        ws.send(msg)
    })
});



app.use('/api', api);
app.use('/api/upload', upload);
app.use('/api/auth', auth)
app.use('/api/settings', settings)
app.use('/api/users', users)
app.use('/api/endpoints', endpoints)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    log.debug('%s %d %s', req.method, res.statusCode, req.url);
    res.json({
        error: 'Not found'
    });
    return;
});

// Error handlers
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    log.error('%s %d %s', req.method, res.statusCode, err.message);
    res.json({
        error: err.message
    });
    return;
});

module.exports = app;
