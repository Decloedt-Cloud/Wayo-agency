import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { loadLocalEnv } from "../src/lib/site";

loadLocalEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL manquant");
  process.exit(1);
}

const sql = postgres(url, { max: 1, prepare: false });
const db = drizzle(sql);

migrate(db, { migrationsFolder: "drizzle" })
  .then(async () => {
    await sql.end();
  })
  .catch(async (error: unknown) => {
    console.error("migrate_failed");
    console.error(error instanceof Error ? error.message : "error");
    await sql.end();
    process.exit(1);
  });
