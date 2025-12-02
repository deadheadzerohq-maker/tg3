-- InfraPulse core schema
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'customer',
  full_name text,
  company_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text not null,
  price_id text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create table public.corridors (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  region text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.corridors enable row level security;

create table public.corridor_risk_snapshots (
  id bigserial primary key,
  corridor_id uuid not null references public.corridors (id) on delete cascade,
  snapshot_time timestamptz not null default now(),
  health_index integer not null,
  weather_risk integer not null,
  closure_risk integer not null,
  congestion_risk integer not null,
  infra_notes text,
  raw_source_payload jsonb,
  created_at timestamptz not null default now()
);

create index on public.corridor_risk_snapshots (corridor_id, snapshot_time desc);

alter table public.corridor_risk_snapshots enable row level security;

create table public.watched_corridors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  corridor_id uuid not null references public.corridors (id) on delete cascade,
  high_risk_threshold integer not null default 40,
  created_at timestamptz not null default now(),
  unique (user_id, corridor_id)
);

alter table public.watched_corridors enable row level security;

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  corridor_id uuid not null references public.corridors (id) on delete cascade,
  snapshot_id bigserial,
  snapshot_time timestamptz not null,
  previous_health integer,
  new_health integer,
  message text not null,
  delivered_via text[] default '{}',
  created_at timestamptz not null default now()
);

alter table public.alerts enable row level security;

create table public.stripe_events (
  id text primary key,
  type text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;

-- RLS policies
create policy "Profiles are viewable by owner or self" on public.profiles for select using (
  auth.uid() = id or exists (
    select 1 from public.profiles p2 where p2.id = auth.uid() and p2.role = 'owner'
  )
);

create policy "Profiles are updatable by self" on public.profiles for update using (auth.uid() = id);

create policy "Users see their subscriptions" on public.subscriptions for select using (user_id = auth.uid());

create policy "Corridors are public read" on public.corridors for select using (true);

create policy "Risk snapshots are public read" on public.corridor_risk_snapshots for select using (true);
