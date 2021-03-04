const db = require('./db')

module.exports.createDB = (app) => {
    db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY    NOT NULL,
            login       TEXT CHAR(25)       NOT NULL UNIQUE,
            password    TEXT                NOT NULL,
            role        INT  CHAR(1)        NOT NULL DEFAULT 0,
            createdAt   INT  CHAR(11)       NOT NULL,
            updatedAt   INT  CHAR(11)       NOT NULL
        )
    `)

    this.createSettings()
}

module.exports.createSettings = () => {
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
