import { copyFileSync, existsSync, statSync } from "node:fs";
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

async function main() {
  if (await hasUsersTable()) {
    return;
  }

  if (!existsSync(template)) {
    console.error(`Database template missing at ${template}`);
    process.exit(1);
  }

  copyFileSync(template, dbFile);
  console.log(`Initialized database at ${dbFile}`);
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
