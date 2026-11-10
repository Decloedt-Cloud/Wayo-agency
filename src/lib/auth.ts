import argon2 from "argon2";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { writeAudit } from "@/lib/audit";
import { authConfig } from "@/lib/auth.config";
import { clientIp, hashIp } from "@/lib/ip";
import { consumeRateLimit, LOGIN_LIMIT, LOGIN_WINDOW_MS } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, request) {
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        const adminEmail = process.env.ADMIN_EMAIL;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        const salt = process.env.IP_HASH_SALT;
        if (!adminEmail || !passwordHash || !salt) return null;

        try {
          const ip = clientIp(request.headers);
          const limit = await consumeRateLimit(`login:${hashIp(ip, salt)}`, LOGIN_LIMIT, LOGIN_WINDOW_MS);
          if (!limit.allowed) {
            await writeAudit("anonymous", "login_locked", "session");
            return null;
          }
          const valid = email === adminEmail && (await argon2.verify(passwordHash, password));
          if (!valid) {
            await writeAudit("anonymous", "login_failed", "session");
            return null;
          }
          await writeAudit(adminEmail, "login_ok", "session");
          return { id: "admin", email: adminEmail, name: "Admin" };
        } catch {
          return null;
        }
      },
    }),
  ],
});
