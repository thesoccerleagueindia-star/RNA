-- RNA Clinic India Tour 2027 — Supabase schema
-- Run in Supabase Dashboard → SQL Editor → New query → Run

-- Waitlist
create table if not exists public.waitlist (
  id text primary key,
  submitted_at timestamptz not null default now(),
  player_name text not null,
  guardian_name text not null,
  age text,
  city text not null,
  category text,
  interest text,
  email text not null,
  phone text,
  consent boolean not null default false,
  created_at timestamptz not null default now()
);

-- Registrations
create table if not exists public.registrations (
  id text primary key,
  submitted_at timestamptz not null default now(),
  player_name text not null,
  guardian_name text not null,
  age text,
  city text not null,
  category text,
  interest text,
  email text not null,
  guardian_contact text,
  fee_payable numeric,
  fee_note text,
  payment_status text default 'unpaid',
  payment_provider text,
  payment_url text,
  razorpay_payment_link_id text,
  guardian_consent boolean not null default false,
  privacy_ack boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists waitlist_submitted_at_idx on public.waitlist (submitted_at desc);
create index if not exists waitlist_city_idx on public.waitlist (city);
create index if not exists registrations_submitted_at_idx on public.registrations (submitted_at desc);
create index if not exists registrations_city_idx on public.registrations (city);

-- RLS
alter table public.waitlist enable row level security;
alter table public.registrations enable row level security;

-- Public forms: allow INSERT with publishable/anon key
drop policy if exists "anon_insert_waitlist" on public.waitlist;
create policy "anon_insert_waitlist"
  on public.waitlist
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "anon_insert_registrations" on public.registrations;
create policy "anon_insert_registrations"
  on public.registrations
  for insert
  to anon, authenticated
  with check (true);

-- No public SELECT (organiser reads via Dashboard / service role)
drop policy if exists "no_public_select_waitlist" on public.waitlist;
-- Deny select for anon by simply not creating a select policy for anon

drop policy if exists "auth_select_waitlist" on public.waitlist;
create policy "auth_select_waitlist"
  on public.waitlist
  for select
  to authenticated
  using (true);

drop policy if exists "auth_select_registrations" on public.registrations;
create policy "auth_select_registrations"
  on public.registrations
  for select
  to authenticated
  using (true);

-- Grants for PostgREST
grant usage on schema public to anon, authenticated;
grant insert on public.waitlist to anon, authenticated;
grant insert on public.registrations to anon, authenticated;
grant select on public.waitlist to authenticated;
grant select on public.registrations to authenticated;

comment on table public.waitlist is 'Clinic India Tour 2027 waitlist submissions';
comment on table public.registrations is 'Clinic India Tour 2027 paid-registration requests';
