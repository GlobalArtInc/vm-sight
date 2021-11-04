const opts = require('optimist').argv;
export const environment = opts.env

export const port = environment === 'dev' ? 3601 : 3600
export const dataDir = environment === 'dev' ? './data' : '/data'
export const jwtSecret = `${dataDir}/vm-sight.pem`