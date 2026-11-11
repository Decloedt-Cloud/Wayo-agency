"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const pendingKey = "wayo-scroll";

function jumpTo(top: number) {
  const root = document.documentElement;
  const previous = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo(0, top);
  root.style.scrollBehavior = previous;
}

function scrollToId(id: string, behavior: ScrollBehavior, started = performance.now()) {
  const target = document.getElementById(id);
  if (!target) {
    if (performance.now() - started < 1500) requestAnimationFrame(() => scrollToId(id, behavior, started));
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY;
  if (Math.abs(target.getBoundingClientRect().top) <= 2) return;
  if (behavior === "auto") jumpTo(top);
  else window.scrollTo({ top, behavior });
}

function followId(id: string) {
  const hidden = [...document.querySelectorAll(".section, .flagship, .footer")].filter((node) => node instanceof HTMLElement);
  const previous = hidden.map((node) => node.style.contentVisibility);
  for (const node of hidden) node.style.contentVisibility = "visible";
  const place = () => {
    const target = document.getElementById(id);
    if (!target) return;
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const dest = Math.min(Math.max(0, target.getBoundingClientRect().top + window.scrollY), max);
    if (Math.abs(window.scrollY - dest) > 2) jumpTo(dest);
  };
  place();
  requestAnimationFrame(() => {
    place();
    requestAnimationFrame(() => {
      place();
      hidden.forEach((node, index) => {
        node.style.contentVisibility = previous[index] ?? "";
      });
    });
  });
}

export function QuietLinks() {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = event.target;
      if (!(source instanceof Element)) return;
      const link = source.closest("a");
      if (!link || link.target === "_blank") return;
      const raw = link.getAttribute("href");
      if (!raw || !raw.includes("#")) {
        try {
          sessionStorage.removeItem(pendingKey);
        } catch {
          // Rien à oublier.
        }
        return;
      }
      let url: URL;
      try {
        url = new URL(raw, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      event.preventDefault();
      event.stopPropagation();
      const next = `${url.pathname}${url.search}`;
      if (url.pathname === window.location.pathname) {
        if (window.location.hash) history.replaceState(history.state, "", next);
        followId(id);
        return;
      }
      try {
        sessionStorage.setItem(pendingKey, id);
      } catch {
        // Navigation privée : l'adresse reste sans ancre, le défilement attend la page suivante.
      }
      window.location.assign(next);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    let stored = "";
    try {
      stored = sessionStorage.getItem(pendingKey) ?? "";
    } catch {
      stored = "";
    }
    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const id = stored || hash;
    if (hash) history.replaceState(history.state, "", `${window.location.pathname}${window.location.search}`);
    if (!id) return;
    const started = performance.now();
    let stopped = false;
    const correct = () => {
      if (stopped) return;
      scrollToId(id, "auto");
      if (performance.now() - started < 4000) return;
      finish();
    };
    const observer = new ResizeObserver(correct);
    observer.observe(document.body);
    const timer = window.setInterval(correct, 200);
    const finish = () => {
      if (stopped) return;
      stopped = true;
      observer.disconnect();
      window.clearInterval(timer);
      window.removeEventListener("wheel", finish, true);
      window.removeEventListener("touchstart", finish, true);
      window.removeEventListener("keydown", finish, true);
      try {
        if (sessionStorage.getItem(pendingKey) === id) sessionStorage.removeItem(pendingKey);
      } catch {
        // La mémoire de navigation est indisponible.
      }
    };
    window.addEventListener("wheel", finish, true);
    window.addEventListener("touchstart", finish, true);
    window.addEventListener("keydown", finish, true);
    correct();
    return () => {
      stopped = true;
      observer.disconnect();
      window.clearInterval(timer);
      window.removeEventListener("wheel", finish, true);
      window.removeEventListener("touchstart", finish, true);
      window.removeEventListener("keydown", finish, true);
    };
  }, [pathname]);

  return null;
}
