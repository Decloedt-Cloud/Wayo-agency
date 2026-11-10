CREATE EXTENSION IF NOT EXISTS pgcrypto;
--> statement-breakpoint
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'won', 'lost', 'spam');
--> statement-breakpoint
CREATE TYPE offer_slug AS ENUM ('audit', 'rescue', 'hardening', 'maintenance', 'production-ready', 'unknown');
--> statement-breakpoint
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  email varchar(254) NOT NULL,
  offer offer_slug NOT NULL DEFAULT 'unknown',
  stack varchar(200),
  message text NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  ip_hash char(64),
  user_agent varchar(300),
  utm_source varchar(100),
  utm_medium varchar(100),
  utm_campaign varchar(100),
  consent_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_message_length CHECK (char_length(message) BETWEEN 10 AND 4000)
);
--> statement-breakpoint
CREATE INDEX leads_status_created_idx ON leads (status, created_at DESC);
--> statement-breakpoint
CREATE INDEX leads_email_idx ON leads (lower(email));
--> statement-breakpoint
CREATE TABLE lead_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE rate_limits (
  key text NOT NULL,
  window_start timestamptz NOT NULL,
  count int NOT NULL DEFAULT 1,
  PRIMARY KEY (key, window_start)
);
--> statement-breakpoint
CREATE TABLE offers (
  id smallserial PRIMARY KEY,
  slug offer_slug UNIQUE NOT NULL,
  position smallint NOT NULL,
  name text NOT NULL,
  short_label text NOT NULL,
  short_description text NOT NULL,
  description text NOT NULL,
  includes text[] NOT NULL DEFAULT '{}',
  price_label text,
  delay_label text,
  is_flagship boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true
);
--> statement-breakpoint
CREATE TABLE faq_items (
  id smallserial PRIMARY KEY,
  position smallint NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  published boolean NOT NULL DEFAULT true
);
--> statement-breakpoint
CREATE TABLE process_steps (
  id smallserial PRIMARY KEY,
  position smallint NOT NULL UNIQUE,
  label text NOT NULL,
  body text NOT NULL
);
--> statement-breakpoint
CREATE TABLE domains (
  id smallserial PRIMARY KEY,
  position smallint NOT NULL UNIQUE,
  name text NOT NULL,
  detail text NOT NULL
);
--> statement-breakpoint
CREATE TABLE audit_example_rows (
  id smallserial PRIMARY KEY,
  position smallint NOT NULL,
  severity text NOT NULL,
  text text NOT NULL,
  CONSTRAINT audit_example_rows_severity CHECK (severity IN ('critique', 'eleve', 'moyen'))
);
--> statement-breakpoint
CREATE TABLE site_settings (
  id boolean PRIMARY KEY DEFAULT true,
  contact_email text,
  booking_url text,
  legal_name text,
  legal_address text,
  legal_id text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_id_true CHECK (id)
);
--> statement-breakpoint
CREATE TABLE admin_audit_log (
  id bigserial PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  entity text NOT NULL,
  entity_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
