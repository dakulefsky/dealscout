const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'dealscout.sqlite');
const db = new Database(DB_PATH);

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ─────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    password    TEXT,
    role        TEXT NOT NULL DEFAULT 'user',
    verified    INTEGER NOT NULL DEFAULT 0,
    otp_code    TEXT,
    otp_expires INTEGER,
    reset_token TEXT,
    reset_expires INTEGER,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS categories (
    id          TEXT PRIMARY KEY,
    name        TEXT UNIQUE NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS deals (
    id              TEXT PRIMARY KEY,
    title           TEXT NOT NULL,
    asin            TEXT NOT NULL,
    category        TEXT,
    original_price  REAL NOT NULL DEFAULT 0,
    sale_price      REAL NOT NULL DEFAULT 0,
    discount_percent REAL NOT NULL DEFAULT 0,
    image_url       TEXT,
    product_url     TEXT NOT NULL,
    rating          REAL,
    ratings_total   INTEGER,
    short_bio       TEXT,
    full_summary    TEXT,
    pros            TEXT,
    cons            TEXT,
    reviews         TEXT,
    source_sufficient INTEGER NOT NULL DEFAULT 1,
    status          TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
    raw_source_data TEXT,
    created_at      INTEGER NOT NULL DEFAULT (unixepoch())
  );
`);

// Seed a default admin user if none exists
const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
if (!adminExists) {
  const { v4: uuidv4 } = require('uuid');
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare(
    'INSERT INTO users (id, email, password, role, verified) VALUES (?, ?, ?, ?, ?)'
  ).run(uuidv4(), 'admin@dealscout.local', hash, 'admin', 1);
  console.log('[db] Seeded admin user: admin@dealscout.local / admin123');
}

module.exports = db;
