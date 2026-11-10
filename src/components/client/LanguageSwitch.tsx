"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { direction, LOCALE_COOKIE, localePath, locales, type Locale } from "@/lib/locale";

export function LanguageSwitch({ locale, pathname, label }: { locale: Locale; pathname: string; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    for (const code of locales) {
      if (code === "fr" || code === locale) continue;
      router.prefetch(localePath(code, pathname));
    }
  }, [locale, pathname, router]);

  function select(code: Locale) {
    if (code === locale || pending) return;
    document.cookie = `${LOCALE_COOKIE}=${code}; Path=/; Max-Age=31536000; SameSite=Lax`;
    document.documentElement.lang = code;
    document.documentElement.dir = direction(code);
    const href = localePath(code, pathname);
    startTransition(() => {
      if (window.location.pathname === href) router.refresh();
      else router.push(href, { scroll: false });
    });
  }

  return (
    <nav className="lang-switch mono" aria-label={label}>
      {locales.map((code) => (
        <button key={code} type="button" onClick={() => select(code)} aria-current={locale === code ? "true" : undefined}>
          {code}
        </button>
      ))}
    </nav>
  );
}
