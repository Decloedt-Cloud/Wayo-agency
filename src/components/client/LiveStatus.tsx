"use client";

import { useEffect } from "react";

export function LiveStatus() {
  useEffect(() => {
    let timer = 0;
    let stopped = false;

    async function check() {
      if (stopped || document.hidden) return;
      try {
        const response = await fetch("/_wayo/live", { cache: "no-store", headers: { Accept: "text/plain" } });
        if (response.status === 503) window.location.reload();
      } catch {
        // Une coupure brève pendant le déploiement est reprise au prochain passage.
      }
    }

    function schedule() {
      window.clearInterval(timer);
      if (document.hidden) return;
      void check();
      timer = window.setInterval(() => void check(), 2000);
    }

    schedule();
    document.addEventListener("visibilitychange", schedule);
    return () => {
      stopped = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, []);

  return null;
}
