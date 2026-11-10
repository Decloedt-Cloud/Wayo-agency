import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/schema";

type Sql = ReturnType<typeof postgres>;

const globalForDb = globalThis as unknown as { wayoSql?: Sql };

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL manquant");
  globalForDb.wayoSql ??= postgres(url, { max: 8, prepare: false, idle_timeout: 20, connect_timeout: 10 });
  return drizzle(globalForDb.wayoSql, { schema });
}

export type Database = ReturnType<typeof getDb>;
