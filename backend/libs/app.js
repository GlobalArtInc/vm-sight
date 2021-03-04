var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var passport = require('passport');

var libs = process.cwd() + '/libs/';

var log = require('./log')(module);

const api = require('./routes/api');
const auth = require('./routes/auth')
const settings = require('./routes/settings')
const users = require('./routes/users')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('jwt-secret', "test")
app.use(passport.initialize());

app.use('/api', api);
app.use('/api/auth', auth)
app.use('/api/settings', settings)
app.use('/api/users', users)

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