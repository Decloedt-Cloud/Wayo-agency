import { resolve4, resolveMx } from "node:dns/promises";

const RESERVED = new Set(["example.com", "example.org", "example.net"]);

export function emailLooksValid(email: string): boolean {
  const value = email.trim();
  if (value.length > 254 || /\s/.test(value)) return false;
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(value);
}

export async function emailDomainAcceptsMail(email: string): Promise<boolean> {
  if (!emailLooksValid(email)) return false;
  const domain = email.trim().slice(email.trim().lastIndexOf("@") + 1).toLowerCase();
  if (RESERVED.has(domain)) return true;
  try {
    const records = await Promise.race([
      resolveMx(domain),
      new Promise<never>((_, reject) => setTimeout(() => reject(Object.assign(new Error("timeout"), { code: "ETIMEOUT" })), 2500)),
    ]);
    if (records.length > 0) return true;
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "ETIMEOUT" || code === "ESERVFAIL" || code === "ECONNREFUSED") return true;
    if (code !== "ENODATA" && code !== "ENOTFOUND") return true;
  }
  try {
    const addresses = await resolve4(domain);
    return addresses.length > 0;
  } catch (error) {
    const code = (error as { code?: string }).code;
    return code === "ETIMEOUT" || code === "ESERVFAIL";
  }
}
