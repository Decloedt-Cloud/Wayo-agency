"use client";

import { useEffect, useRef, useState } from "react";

import type { Ui } from "@/lib/copy";
import { localePath, type Locale } from "@/lib/locale";

type Errors = Record<string, string>;

export function ContactForm({ locale, form, privacy }: { locale: Locale; form: Ui["form"]; privacy: string }) {
  const options = [
    { value: "audit", label: form.offers.audit },
    { value: "rescue", label: form.offers.rescue },
    { value: "hardening", label: form.offers.hardening },
    { value: "maintenance", label: form.offers.maintenance },
    { value: "production-ready", label: form.offers["production-ready"] },
    { value: "unknown", label: form.offers.unknown },
  ] as const;
  const startedAt = useRef(0);
  if (startedAt.current === 0) {
    let saved = 0;
    if (typeof window !== "undefined") {
      try {
        saved = Number(sessionStorage.getItem("wayo-lead-started"));
      } catch {
        saved = 0;
      }
    }
    startedAt.current = Number.isFinite(saved) && saved > 0 ? saved : Date.now();
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("wayo-lead-started", String(startedAt.current));
      } catch {
        /* private mode */
      }
    }
  }
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [formError, setFormError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setFormError("");
    setErrors({});
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      offer: String(data.get("offer") ?? "unknown"),
      stack: String(data.get("stack") ?? ""),
      message: String(data.get("message") ?? ""),
      consent: data.get("consent") === "on",
      website: String(data.get("website") ?? ""),
      locale,
      startedAt: startedAt.current,
      utmSource: new URLSearchParams(window.location.search).get("utm_source") ?? "",
      utmMedium: new URLSearchParams(window.location.search).get("utm_medium") ?? "",
      utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") ?? "",
    };
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.status === 200 || response.status === 201) {
        setDone(true);
        return;
      }
      if (response.status === 400) {
        const body = (await response.json()) as { errors?: Errors };
        setErrors(body.errors ?? {});
        return;
      }
      if (response.status === 429) {
        setFormError(form.tooMany);
        return;
      }
      setFormError(form.failed);
    } catch {
      setFormError(form.failed);
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return <p className="serif" style={{ fontSize: "clamp(32px, 4vw, 56px)", lineHeight: 1.05 }}>{form.success}</p>;
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <label className="hp" htmlFor="website">Site</label>
      <input className="hp" id="website" name="website" tabIndex={-1} autoComplete="off" />
      <Field id="name" name="name" label={form.name} autoComplete="name" error={errors.name} />
      <Field id="email" name="email" label={form.email} type="email" autoComplete="email" error={errors.email} />
      <OfferField label={form.offer} options={options} error={errors.offer} />
      <Field id="stack" name="stack" label={form.stack} error={errors.stack} />
      <div>
        <label className="mono faint" htmlFor="message">{form.message}</label>
        <textarea id="message" name="message" className="field" rows={4} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "message-error" : undefined} />
        {errors.message ? <p id="message-error" className="alert" role="alert">{errors.message}</p> : null}
      </div>
      <label style={{ display: "flex", gap: 12, alignItems: "flex-start", minHeight: 44 }}>
        <input type="checkbox" name="consent" aria-describedby={errors.consent ? "consent-error" : undefined} style={{ width: 18, height: 18, marginTop: 4 }} />
        <span>{form.consent} <a className="link" href={localePath(locale, "/confidentialite")}>{privacy}</a></span>
      </label>
      {errors.consent ? <p id="consent-error" className="alert" role="alert">{errors.consent}</p> : null}
      {formError ? <p className="alert" role="alert">{formError}</p> : null}
      <button className="btn" type="submit" disabled={pending}>{pending ? form.sending : form.send}</button>
    </form>
  );
}

function OfferField({
  label,
  options,
  error,
}: {
  label: string;
  options: readonly { value: string; label: string }[];
  error?: string;
}) {
  const [value, setValue] = useState("unknown");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  function move(direction: 1 | -1) {
    const index = options.findIndex((option) => option.value === value);
    const next = options[Math.min(options.length - 1, Math.max(0, index + direction))];
    if (next) setValue(next.value);
    setOpen(true);
  }

  function onKey(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((currentOpen) => !currentOpen);
    }
  }

  return (
    <div className="offer-field" ref={rootRef}>
      <label className="mono faint" id="offer-label" htmlFor="offer">{label}</label>
      <input type="hidden" name="offer" value={value} />
      <button
        id="offer"
        type="button"
        className="field offer-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="offer-list"
        aria-labelledby="offer-label offer-value"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "offer-error" : undefined}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        onKeyDown={onKey}
      >
        <span id="offer-value">{current?.label}</span>
        <span className="offer-chevron" aria-hidden="true" />
      </button>
      <ul id="offer-list" className="offer-list" role="listbox" aria-labelledby="offer-label" hidden={!open}>
        {options.map((option) => (
          <li key={option.value} role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                setValue(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
      {error ? <p id="offer-error" className="alert" role="alert">{error}</p> : null}
    </div>
  );
}

function Field({ id, name, label, type = "text", autoComplete, error }: { id: string; name: string; label: string; type?: string; autoComplete?: string; error?: string }) {
  return (
    <div>
      <label className="mono faint" htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} className="field" aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
      {error ? <p id={`${id}-error`} className="alert" role="alert">{error}</p> : null}
    </div>
  );
}
