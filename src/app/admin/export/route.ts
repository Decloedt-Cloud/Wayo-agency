import { desc } from "drizzle-orm";
import { requireAdmin } from "@/lib/audit";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/schema";

function cell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return new Response("Non autorisé", { status: 401 });
  const rows = await getDb().select().from(leads).orderBy(desc(leads.createdAt));
  const lines = ["id,name,email,offer,stack,message,status,created_at"];
  for (const row of rows) {
    lines.push(
      [
        row.id,
        row.name,
        row.email,
        row.offer,
        row.stack ?? "",
        row.message,
        row.status,
        row.createdAt.toISOString(),
      ].map(cell).join(","),
    );
  }
  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=leads.csv",
    },
  });
}
