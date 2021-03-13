global.env = "development"
global.data = "./data"
const fs = require('fs')

if (!fs.existsSync(global.data)) {
    fs.mkdirSync(global.data);
}

const libs = './libs/';
const log = require(libs + 'log')(module);
const init = require(libs + 'init')
const app = require(libs + 'app');
const port = 3601;

app.listen(port, () => {
    console.clear()
    init.createDB()
    log.info(`Server listening on the port::${port}`);
});
