-- Lookups table: every check, single or bulk
create table if not exists public.lookups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  input_value text not null,
  normalized_value text,
  carrier_name text,
  dot_number text,
  mc_number text,
  authority_status text,
  insurance_status text,
  risk_score integer,
  risk_level text,
  raw jsonb
);

-- Alerts table: future insurance/authority alerts
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  dot_number text,
  mc_number text,
  carrier_name text,
  alert_type text not null,
  alert_message text not null,
  resolved boolean not null default false,
  resolved_at timestamptz
);
