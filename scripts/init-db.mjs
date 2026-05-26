import { copyFileSync, existsSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createClient } from "@libsql/client";

const dbFile = process.env.ASTRO_DATABASE_FILE || "/app/data/content.db";
const template = "/app/db-init/content.db";

async function hasUsersTable() {
  if (!existsSync(dbFile) || statSync(dbFile).size === 0) {
    return false;
  }

  const client = createClient({ url: `file:${dbFile}` });
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

async function linksHasOpenInNewTab() {
  const client = createClient({ url: `file:${dbFile}` });
  try {
    const result = await client.execute("PRAGMA table_info(Links)");
    return result.rows.some((row) => row.name === "openInNewTab");
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
  copyFileSync(template, dbFile);
  console.log(`Initialized database from template at ${dbFile}`);
}

function pushSchema() {
  console.log(`Pushing database schema to ${dbFile}`);
  execFileSync("npx", ["astro", "db", "push", "--force"], {
    stdio: "inherit",
    env: process.env,
  });
}

async function main() {
  if (await hasUsersTable()) {
    if (!(await linksHasOpenInNewTab())) {
      console.log("Applying database schema updates...");
      pushSchema();
    } else {
      console.log(`Database ready at ${dbFile}`);
    }
    return;
  }

  console.log(`Database missing tables at ${dbFile}, initializing...`);

  try {
    pushSchema();
    if (await hasUsersTable()) {
      return;
    }
  } catch (error) {
    console.error("astro db push failed, falling back to template:", error);
  }

  copyTemplate();

  if (!(await hasUsersTable())) {
    throw new Error(`Database initialization failed for ${dbFile}`);
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
