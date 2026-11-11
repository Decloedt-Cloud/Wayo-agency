"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { localePath, type Locale } from "@/lib/locale";

type RailCopy = { home: string; constat: string; method: string; offers: string; faq: string; book: string; footer: string };
type IconName = keyof RailCopy;

const sections = ["constat", "methode", "offres", "faq", "contact", "footer"] as const;

export function SideRail({ locale, label, items }: { locale: Locale; label: string; items: RailCopy }) {
  const pathname = usePathname();
  const home = localePath(locale, "/");
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<IconName>("home");

  const links: { id: IconName; href: string }[] = [
    { id: "home", href: home },
    { id: "constat", href: `${home}#constat` },
    { id: "method", href: `${home}#methode` },
    { id: "offers", href: `${home}#offres` },
    { id: "faq", href: `${home}#faq` },
    { id: "book", href: `${home}#contact` },
    { id: "footer", href: `${home}#footer` },
  ];

  useEffect(() => {
    const names: Record<(typeof sections)[number], IconName> = {
      constat: "constat",
      methode: "method",
      offres: "offers",
      faq: "faq",
      contact: "book",
      footer: "footer",
    };
    const mark = () => {
      if (pathname !== home) {
        setCurrent(pathname.includes("/offres/") ? "offers" : "home");
        return;
      }
      let next: IconName = "home";
      for (const id of sections) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= 180) next = names[id];
      }
      const footerNode = document.getElementById("footer");
      const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const footerTop = footerNode?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;
      if (window.scrollY >= max - 24 || footerTop < window.innerHeight * 0.5) next = "footer";
      setCurrent(next);
    };
    mark();
    window.addEventListener("scroll", mark, { passive: true });
    return () => window.removeEventListener("scroll", mark);
  }, [pathname, home]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="side-rail"
      aria-label={label}
      data-open={open ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOpen(true);
      }}
      onPointerLeave={(event) => {
        setOpen(false);
        const active = document.activeElement;
        if (active instanceof HTMLElement && event.currentTarget.contains(active)) active.blur();
      }}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) setOpen(false);
      }}
    >
      {links.map((item) => (
        <a
          key={item.id}
          href={item.href}
          aria-current={current === item.id ? "page" : undefined}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
            const coarse = window.matchMedia("(hover: none)").matches;
            if (coarse && !open) {
              event.preventDefault();
              setOpen(true);
              return;
            }
            const [path, hash] = item.href.split("#");
            const reduce = document.documentElement.classList.contains("reduce");
            if (hash && path === window.location.pathname) {
              event.preventDefault();
              const node = document.getElementById(hash);
              if (!node) return;
              const top = node.getBoundingClientRect().top + window.scrollY;
              window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
              if (window.location.hash) history.replaceState(history.state, "", path);
              return;
            }
            if (!hash && path === window.location.pathname) {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
            }
          }}
        >
          <span className="side-dot" aria-hidden="true" />
          <span className="side-label">{items[item.id]}</span>
          <span className="side-mark">
            <RailIcon name={item.id} />
          </span>
        </a>
      ))}
    </nav>
  );
}

function RailIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {name === "home" ? (
        <path d="M4 10.5 12 4l8 6.5V20H4Z" />
      ) : null}
      {name === "constat" ? (
        <>
          <path d="M12 4 3.5 19h17L12 4z" />
          <path d="M12 10v4" />
          <path d="M12 16.5h.01" />
        </>
      ) : null}
      {name === "method" ? (
        <>
          <path d="M12 5v14" />
          <circle cx="12" cy="5" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="12" cy="19" r="1.7" />
        </>
      ) : null}
      {name === "offers" ? (
        <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
      ) : null}
      {name === "faq" ? <path d="M4 16l4.5-5 4 3L20 6" /> : null}
      {name === "book" ? (
        <>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H12v15.5H6.5A2.5 2.5 0 0 0 4 17z" />
          <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H12v15.5h5.5a2.5 2.5 0 0 1 2.5 2.5z" />
        </>
      ) : null}
      {name === "footer" ? (
        <>
          <path d="M5 4h14v16H5z" />
          <path d="M5 15h14" />
        </>
      ) : null}
    </svg>
  );
}
