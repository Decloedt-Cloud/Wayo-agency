export function siteOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return "http://localhost:3000";
  return configured.replace(/\/$/, "");
}

function loopback(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function isAllowedOrigin(origin: string | null, requestOrigin: string): boolean {
  if (!origin) return false;
  if (origin === requestOrigin) return true;
  try {
    const sent = new URL(origin);
    const received = new URL(requestOrigin);
    const samePort = sent.port === received.port;
    const sameProtocol = sent.protocol === received.protocol;
    if (sameProtocol && samePort && loopback(sent.hostname) && loopback(received.hostname)) return true;
    return origin === new URL(siteOrigin()).origin;
  } catch {
    return false;
  }
}

export function loadLocalEnv() {
  if (process.env.DATABASE_URL) return;
  try {
    process.loadEnvFile(".env");
  } catch {
    /* absent en CI ou dans le conteneur */
  }
}
