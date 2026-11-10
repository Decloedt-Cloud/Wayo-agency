import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  async function logout() {
    "use server";
    await signOut({ redirectTo: "/admin/login" });
  }

  return (
    <div className="admin wrap">
      <nav style={{ display: "flex", flexWrap: "wrap", gap: 18, alignItems: "center", marginBottom: 28 }}>
        <a className="link" href="/admin">Leads</a>
        <a className="link" href="/admin/content">Contenu</a>
        <a className="link" href="/admin/export">Export CSV</a>
        <form action={logout}>
          <button className="btn" type="submit">Sortir</button>
        </form>
      </nav>
      {children}
    </div>
  );
}
