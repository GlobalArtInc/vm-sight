import * as fs from 'fs';
import {dbQuery} from "./DB";
import {generateKeyPairSync} from "crypto";

class Init {
    public async start() {
        await dbQuery(`CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY    NOT NULL,
            username    TEXT CHAR(25)       NOT NULL UNIQUE,
            password    TEXT                NOT NULL,
            role        INT  CHAR(1)        NOT NULL DEFAULT 0,
            createdAt   INT  CHAR(11)       NOT NULL,
            updatedAt   INT  CHAR(11)       NOT NULL
        )`)
        await Init.createSettings()
        await Init.createSnapshots()
        await Init.createEndpoints()
        await Init.createRegistries()
        Init.generateKeys()
    }

    private static async createSnapshots() {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS snapshots (
                endpoint_id      TEXT PRIMARY KEY    NOT NULL,
                data             TEXT                NOT NULL,
                createdAt   INT  CHAR(11)            NOT NULL
            )`
        )
    }

    private static async createSettings() {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS settings (
                key         TEXT PRIMARY KEY    NOT NULL,
                value       TEXT
            )`
        )
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("LogoURL", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("AuthenticationMethod", "1")`)

        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthClientID", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthClientSecret", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthAuthorizationURL", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthAccessTokenURL", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthUserURL", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthRedirectURL", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthUserIdentifier", "")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("OAuthScopes", "")`)

        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("SnapshotInterval", "5m")`)
        await dbQuery(`INSERT OR IGNORE INTO settings(key, value) VALUES ("UserSessionTimeout", "8h")`)
    }

    private static async createEndpoints() {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS endpoints (
                id          TEXT PRIMARY KEY NOT NULL,
                name        TEXT NOT NULL,
                type        INT NOT NULL,
                public_url  TEXT,
                url         TEXT NOT NULL,
                groupId     INT NOT NULL DEFAULT 0,
                tags        STRING,
                tls         INT CHAR(1) DEFAULT 0,
                tls_ca      INT CHAR(1) DEFAULT 0,
                tls_cert    INT CHAR(1) DEFAULT 0,
                tls_key     INT CHAR(1) DEFAULT 0              
            )`
        )
    }

    private static async createRegistries() {
        await dbQuery(`
            CREATE TABLE IF NOT EXISTS registries (
                id          TEXT PRIMARY KEY NOT NULL,
                user_id     TEXT NOT NULL,
                type        TEXT NOT NULL,
                name        TEXT NOT NULL,
                url         TEXT,
                login       TEXT,
                password    TEXT,
                createdAt   INT CHAR(11) NOT NULL
            )`
        )
        await dbQuery(`
                INSERT OR IGNORE INTO registries (id, user_id, type, name, createdAt)
                VALUES ('dockerhub', '0', 'dockerhub', 'DockerHub', strftime('%s', 'now'))`
        )
    }

    private static generateKeys() {
        const key = `${global.data}/vm-sight.pem`
        const pub = `${global.data}/vm-sight.pub`

        const {publicKey, privateKey} = generateKeyPairSync('rsa',
            {
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });

        if (!fs.existsSync(key)) {
            fs.appendFileSync(key, privateKey)
        }
        if (!fs.existsSync(pub)) {
            fs.appendFileSync(pub, publicKey)
        }
    }

}

export default Init