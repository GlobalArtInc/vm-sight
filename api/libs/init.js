const db = require('./db')

module.exports.createDB = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY    NOT NULL,
            username    TEXT CHAR(25)       NOT NULL UNIQUE,
            password    TEXT                NOT NULL,
            role        INT  CHAR(1)        NOT NULL DEFAULT 0,
            createdAt   INT  CHAR(11)       NOT NULL,
            updatedAt   INT  CHAR(11)       NOT NULL
        )
    `)

    this.createSettings()
    this.createSnapshots()
    this.createEndpoints()
}

module.exports.createSnapshots = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS snapshots (
            endpoint_id      TEXT PRIMARY KEY    NOT NULL,
            data             TEXT                NOT NULL,
            createdAt   INT  CHAR(11)            NOT NULL
        )
    `)
}

module.exports.createSettings = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS settings (
            key         TEXT PRIMARY KEY    NOT NULL,
            value       TEXT
        )
    `)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("LogoURL", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("AuthenticationMethod", "1")`)

    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthClientID", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthClientSecret", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthAuthorizationURL", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthAccessTokenURL", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthUserURL", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthRedirectURL", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthUserIdentifier", "")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthScopes", "")`)

    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("SnapshotInterval", "5m")`)
    await db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("UserSessionTimeout", "8h")`)
}

module.exports.createEndpoints = async () => {
    await db.query(`
        CREATE TABLE IF NOT EXISTS endpoints (
            id          TEXT PRIMARY KEY     NOT NULL,
            name        TEXT                 NOT NULL,
            type        INT                  NOT NULL,
            url         TEXT                 NOT NULL,
            groupId     INT                  NOT NULL DEFAULT 0,
            tags        STRING                                 ,
            tls         INT CHAR(1)          DEFAULT 0         ,
            tls_ca      STRING                                 ,
            tls_cert    STRING                                 ,
            tls_key     STRING                                 
        )
    `)
}
