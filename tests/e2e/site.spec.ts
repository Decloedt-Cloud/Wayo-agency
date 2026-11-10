import { expect, test } from "@playwright/test";
import postgres from "postgres";

const origin = "http://127.0.0.1:3000";

function payload(email: string, extra: Record<string, string> = {}) {
  return {
    name: "Ada Lovelace",
    email,
    offer: "audit",
    stack: "Next.js",
    message: "Le déploiement échoue depuis la dernière génération.",
    consent: true,
    website: "",
    startedAt: Date.now() - 10_000,
    ...extra,
  };
}

test("le formulaire crée un lead", async ({ page }) => {
  const email = `e2e-${Date.now()}@example.com`;
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `203.0.113.${Date.now() % 200}` });
  await page.goto("/");
  await page.locator("#name").fill("Ada Lovelace");
  await page.locator("#email").fill(email);
  await page.locator("#offer").selectOption("audit");
  await page.locator("#stack").fill("Next.js");
  await page.locator("#message").fill("Le déploiement échoue depuis la dernière génération.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Envoyer →" }).click();
  await expect(page.getByText("Merci, on vous répond sous 48 h ouvrées.")).toBeVisible();
  const sql = postgres(process.env.DATABASE_URL ?? "", { max: 1, prepare: false });
  const rows = await sql`select id from leads where email = ${email}`;
  await sql.end();
  expect(rows.length).toBe(1);
});

test("le honeypot ne crée rien", async ({ request }) => {
  const email = `honeypot-${Date.now()}@example.com`;
  const response = await request.post("/api/leads", {
    headers: { origin, "x-forwarded-for": "198.51.100.8" },
    data: payload(email, { website: "https://spam.example" }),
  });
  expect(response.status()).toBe(200);
  const sql = postgres(process.env.DATABASE_URL ?? "", { max: 1, prepare: false });
  const rows = await sql`select id from leads where email = ${email}`;
  await sql.end();
  expect(rows.length).toBe(0);
});

test("le sixième envoi renvoie 429", async ({ request }) => {
  const ip = `198.51.100.${20 + (Date.now() % 20)}`;
  let status = 0;
  for (let index = 0; index < 6; index += 1) {
    const response = await request.post("/api/leads", {
      headers: { origin, "x-forwarded-for": ip },
      data: payload(`rate-${Date.now()}-${index}@example.com`),
    });
    status = response.status();
  }
  expect(status).toBe(429);
});

test("la FAQ se commande au clavier", async ({ page }) => {
  await page.goto("/#faq");
  const first = page.getByRole("button", { name: "Dois-je réécrire mon application ?" });
  await first.focus();
  await expect(first).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Space");
  await expect(first).toHaveAttribute("aria-expanded", "true");
});

test("aucun défilement horizontal à 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("l'admin refuse un accès non connecté", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto("/admin/content");
  await expect(page).toHaveURL(/\/admin\/login/);
});
