import { loginAction } from "../actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const params = await searchParams;
  return (
    <main className="admin wrap" style={{ maxWidth: 480, paddingTop: 80 }}>
      <h1 className="serif" style={{ fontSize: 64, lineHeight: 0.95, margin: 0 }}>Admin</h1>
      <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 36 }}>
        <label className="mono faint" htmlFor="email">Email</label>
        <input className="field" id="email" name="email" type="email" autoComplete="username" required />
        <label className="mono faint" htmlFor="password">Mot de passe</label>
        <input className="field" id="password" name="password" type="password" autoComplete="current-password" required />
        {params.erreur ? <p className="alert" role="alert">Identifiants refusés.</p> : null}
        <button className="btn" type="submit">Entrer</button>
      </form>
    </main>
  );
}
