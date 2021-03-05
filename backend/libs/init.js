const db = require('./db')

module.exports.createDB = () => {
    db.query(`
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

module.exports.createSnapshots = () => {
    db.query(`
        CREATE TABLE IF NOT EXISTS snapshots (
            endpoint_id      TEXT PRIMARY KEY    NOT NULL,
            data             TEXT                NOT NULL,
            createdAt   INT  CHAR(11)            NOT NULL
        )
    `)
}

module.exports.createSettings = async () => {
    db.query(`
        CREATE TABLE IF NOT EXISTS settings (
            key         TEXT PRIMARY KEY    NOT NULL,
            value       TEXT
        )
    `)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("LogoURL", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("AuthenticationMethod", "1")`)

    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthClientID", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthClientSecret", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthAuthorizationURL", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthAccessTokenURL", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthUserURL", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthRedirectURL", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthUserIdentifier", "")`)
    db.query(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthScopes", "")`)
}

module.exports.createEndpoints = async () => {
    db.query(`
        CREATE TABLE IF NOT EXISTS endpoints (
            id          TEXT PRIMARY KEY     NOT NULL,
            name        TEXT                 NOT NULL,
            type        INT                  NOT NULL,
            url         TEXT                 NOT NULL,
            groupId     INT                  NOT NULL DEFAULT 0,
            tags        STRING
        )
    `)
}
