const opts = require('optimist').argv;
export const environment = opts.env

export const dataDir = environment === 'dev' ? './data' : '/data'