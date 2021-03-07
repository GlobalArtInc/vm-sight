/*const libs = './libs/';
const log = require(libs + 'log')(module);
const app = require(libs + 'app');
const init = require(libs + 'init')

app.set('port', 3601);

app.listen(app.get('port'), function () {
    console.clear()
    init.createDB()
    log.info('Express server listening on port ' + app.get('port'));
});
*/
const libs = './libs/';
const log = require(libs + 'log')(module);
const app = require(libs + 'app');
const init = require(libs + 'init')
const express = require('express');
const path = require('path');
port = 3600;

app.listen(port, () => {
    console.clear()
    init.createDB()
    log.info(`Server listening on the port::${port}`);
});