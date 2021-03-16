const express = require('express');
const db = require('../db')
const router = express.Router();


/*
router.use('/', function (req, res) {

    var io = req.app.get('socketio');

    io.on('connection', function(socket){

        socket.on('newRideAdded', function(exclude){
            io.emit('newRideAdded', exclude);
        });

        console.log('a user connected');
        socket.on('disconnect', function(){
            console.log('user disconnected');
        });

    });

    res.json({
        response: false
    });
});
*/
module.exports = router
