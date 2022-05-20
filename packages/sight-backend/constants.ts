const opts = require('optimist').argv;
export const environment = opts.env

export const port = environment === 'dev' ? 3700 : 3600
export const dataDir = environment === 'dev' ? '../../data' : '/data'
export const jwtSecret = `${dataDir}/vm-sight.pem`
export const appVersion = `1.0${environment === 'dev' ? '-dev' : ''}`
