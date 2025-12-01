-- Supabase schema for TenderGuard
-- Enable pgcrypto for gen_random_uuid()
create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  first_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  email text not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lookups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null,
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
  notes text,
  raw jsonb
);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid not null,
  email text not null,
  dot_number text,
  mc_number text,
  carrier_name text,
  alert_type text not null,
  alert_message text not null,
  resolved boolean not null default false,
  resolved_at timestamptz
);

-- Row Level Security can be enabled to restrict each table to the authenticated user.
-- alter table public.profiles enable row level security;
-- alter table public.subscribers enable row level security;
-- alter table public.lookups enable row level security;
-- alter table public.alerts enable row level security;
