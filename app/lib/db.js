import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { dirname, join } from "path";

const dbPath =
  process.env.SQLITE_PATH ||
  process.env.DATABASE_PATH ||
  (process.env.VERCEL ? join("/tmp", "nihongo.sqlite") : join(process.cwd(), "data", "nihongo.sqlite"));

mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath, { timeout: 5000 });
db.pragma("busy_timeout = 5000");

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pinHash TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    lastSeenAt TEXT NOT NULL,
    UNIQUE(name)
  );

  CREATE TABLE IF NOT EXISTS progress (
    profileId TEXT PRIMARY KEY,
    currentNodeId TEXT NOT NULL,
    unlockedNodeIds TEXT NOT NULL,
    passedNodeIds TEXT NOT NULL,
    scores TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id TEXT PRIMARY KEY,
    profileId TEXT NOT NULL,
    nodeId TEXT NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    passed INTEGER NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY(profileId) REFERENCES profiles(id)
  );
`);

export default db;
