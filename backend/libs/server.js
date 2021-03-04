const libs = process.cwd() + '/libs/';
const log = require(libs + 'log')(module);
const app = require(libs + 'app');
const init = require(libs + 'init')

app.set('port', 3601);

const server = app.listen(app.get('port'), function () {
    console.clear()
    init.createDB()
    log.info('Express server listening on port ' + app.get('port'));
});