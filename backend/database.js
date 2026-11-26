const { DatabaseSync } = require('node:sqlite');
const { mkdirSync } = require('node:fs');
const { join } = require('node:path');

function openDatabase() {
    const directory = process.env.FUTURE_DATA_DIR || join(__dirname, 'data');
    mkdirSync(directory, { recursive: true });
    const db = new DatabaseSync(join(directory, 'academy.sqlite'), { timeout: 5000 });
    db.exec(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions (
            digest TEXT PRIMARY KEY, account_id INTEGER NOT NULL REFERENCES accounts(id), expires INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY, account_id INTEGER REFERENCES accounts(id),
            kind TEXT NOT NULL, subject TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL,
            phone TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS applications_account ON applications(account_id, id);
        CREATE INDEX IF NOT EXISTS sessions_expiration ON sessions(expires);
    `);
    return db;
}

module.exports = { openDatabase };
