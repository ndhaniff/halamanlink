import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname } from "node:path";
import { createClient } from "@libsql/client";

const dbFile = process.env.ASTRO_DATABASE_FILE || "/app/data/content.db";
const template = "/app/db-init/content.db";

function toLibsqlUrl(filePath) {
  if (filePath.startsWith("file:")) return filePath;
  return `file:${filePath}`;
}

function getClient() {
  return createClient({ url: toLibsqlUrl(dbFile) });
}

async function hasUsersTable() {
  if (!existsSync(dbFile) || statSync(dbFile).size === 0) {
    return false;
  }

  const client = getClient();
  try {
    const result = await client.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'Users'",
    );
    return result.rows.length > 0;
  } catch {
    return false;
  } finally {
    client.close();
  }
}

async function columnExists(table, column) {
  const client = getClient();
  try {
    const result = await client.execute(`PRAGMA table_info(${table})`);
    return result.rows.some((row) => row.name === column);
  } catch {
    return false;
  } finally {
    client.close();
  }
}

function copyTemplate() {
  if (!existsSync(template)) {
    throw new Error(`Database template missing at ${template}`);
  }
  mkdirSync(dirname(dbFile), { recursive: true });
  copyFileSync(template, dbFile);
  console.log(`Initialized database from template at ${dbFile}`);
}

async function applyMigrations() {
  const client = getClient();
  try {
    if (!(await columnExists("Links", "openInNewTab"))) {
      console.log("Migration: Links.openInNewTab");
      await client.execute(
        "ALTER TABLE Links ADD COLUMN openInNewTab INTEGER NOT NULL DEFAULT 1",
      );
    }

    if (!(await columnExists("Profiles", "locationLat"))) {
      console.log("Migration: Profiles location columns");
      await client.execute("ALTER TABLE Profiles ADD COLUMN locationLat REAL");
      await client.execute("ALTER TABLE Profiles ADD COLUMN locationLng REAL");
      await client.execute(
        "ALTER TABLE Profiles ADD COLUMN locationLabel TEXT NOT NULL DEFAULT ''",
      );
    }

    if (!(await columnExists("Links", "kind"))) {
      console.log("Migration: Links.kind");
      await client.execute(
        "ALTER TABLE Links ADD COLUMN kind TEXT NOT NULL DEFAULT 'link'",
      );
    }
  } finally {
    client.close();
  }
}

async function main() {
  console.log(`Checking database at ${dbFile}`);

  if (!(await hasUsersTable())) {
    console.log(`Database missing tables at ${dbFile}, initializing...`);
    copyTemplate();
    if (!(await hasUsersTable())) {
      throw new Error(`Database initialization failed for ${dbFile}`);
    }
  }

  await applyMigrations();
  console.log(`Database ready at ${dbFile}`);
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
