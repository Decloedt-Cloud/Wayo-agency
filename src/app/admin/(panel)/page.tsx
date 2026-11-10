import { and, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { addLeadNote, deleteLead, updateLeadStatus } from "../actions";
import { getDb } from "@/lib/db";
import { leadNotes, leads } from "@/lib/schema";
import { offerSlugs } from "@/lib/validators";

const pageSize = 25;
const statuses = [
  ["new", "Nouveau"],
  ["contacted", "Contacté"],
  ["qualified", "Qualifié"],
  ["won", "Gagné"],
  ["lost", "Perdu"],
  ["spam", "Spam"],
] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; offer?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const status = statuses.some(([value]) => value === params.status) ? params.status : "";
  const offer = (offerSlugs as readonly string[]).includes(params.offer ?? "") ? params.offer : "";
  const q = (params.q ?? "").replace(/[%_]/g, "").slice(0, 254);
  const filters = [];
  if (status) filters.push(eq(leads.status, status as (typeof statuses)[number][0]));
  if (offer) filters.push(eq(leads.offer, offer as (typeof offerSlugs)[number]));
  if (q) filters.push(ilike(leads.email, `%${q}%`));
  const where = filters.length ? and(...filters) : undefined;
  const db = getDb();
  const rows = await db
    .select()
    .from(leads)
    .where(where)
    .orderBy(desc(leads.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
  const [count] = await db.select({ n: sql<number>`count(*)::int` }).from(leads).where(where);
  const notes = rows.length
    ? await db.select().from(leadNotes).where(inArray(leadNotes.leadId, rows.map((row) => row.id))).orderBy(desc(leadNotes.createdAt))
    : [];
  const pages = Math.max(1, Math.ceil(Number(count?.n ?? 0) / pageSize));

  return (
    <>
      <h1 className="serif" style={{ fontSize: 56, margin: 0 }}>Leads</h1>
      <form style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "24px 0" }}>
        <select className="field" name="status" defaultValue={status} aria-label="Statut">
          <option value="">Tous les statuts</option>
          {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <select className="field" name="offer" defaultValue={offer ?? ""} aria-label="Offre">
          <option value="">Toutes les offres</option>
          {offerSlugs.map((slug) => <option key={slug} value={slug}>{slug}</option>)}
        </select>
        <input className="field" name="q" defaultValue={q} placeholder="Email" aria-label="Email" />
        <button className="btn" type="submit">Filtrer</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Nom</th><th>Email</th><th>Offre</th><th>Message</th><th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="mono">{row.createdAt.toISOString().slice(0, 16).replace("T", " ")}</td>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td className="mono">{row.offer}</td>
              <td>
                <p style={{ margin: 0 }}>{row.message}</p>
                {row.stack ? <p className="faint">{row.stack}</p> : null}
                {notes.filter((note) => note.leadId === row.id).map((note) => (
                  <p key={note.id} className="faint">{note.body}</p>
                ))}
                <form action={addLeadNote} style={{ marginTop: 8 }}>
                  <input type="hidden" name="id" value={row.id} />
                  <input className="field" name="body" aria-label="Note" />
                  <button className="btn" type="submit">Noter</button>
                </form>
              </td>
              <td>
                <form action={updateLeadStatus}>
                  <input type="hidden" name="id" value={row.id} />
                  <select className="field" name="status" defaultValue={row.status} aria-label="Changer le statut">
                    {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                  <button className="btn" type="submit">Mettre à jour</button>
                </form>
                <form action={deleteLead} style={{ marginTop: 8 }}>
                  <input type="hidden" name="id" value={row.id} />
                  <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input type="checkbox" name="confirm" />
                    Suppression définitive
                  </label>
                  <button className="btn" type="submit">Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mono faint" style={{ marginTop: 16 }}>Page {page} / {pages}</p>
      <div style={{ display: "flex", gap: 16 }}>
        {page > 1 ? <a className="link" href={`/admin?page=${page - 1}`}>Précédent</a> : null}
        {page < pages ? <a className="link" href={`/admin?page=${page + 1}`}>Suivant</a> : null}
      </div>
    </>
  );
}
