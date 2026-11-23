-- FIX: allow public form inserts with the publishable/anon key
-- Run in Supabase → SQL Editor if inserts return:
--   "new row violates row-level security policy"
--
-- Safe for public brochure forms: INSERT only, no public SELECT.

alter table public.waitlist enable row level security;
alter table public.registrations enable row level security;

-- Drop prior policies (names from schema.sql or dashboard)
drop policy if exists "anon_insert_waitlist" on public.waitlist;
drop policy if exists "anon_insert_registrations" on public.registrations;
drop policy if exists "public_insert_waitlist" on public.waitlist;
drop policy if exists "public_insert_registrations" on public.registrations;
drop policy if exists "Allow public inserts" on public.waitlist;
drop policy if exists "Allow public inserts" on public.registrations;

-- Apply to ALL roles (covers anon + new publishable key roles)
create policy "public_insert_waitlist"
  on public.waitlist
  for insert
  with check (true);

create policy "public_insert_registrations"
  on public.registrations
  for insert
  with check (true);

-- Authenticated read (optional admin)
drop policy if exists "auth_select_waitlist" on public.waitlist;
create policy "auth_select_waitlist"
  on public.waitlist for select to authenticated using (true);

drop policy if exists "auth_select_registrations" on public.registrations;
create policy "auth_select_registrations"
  on public.registrations for select to authenticated using (true);

grant usage on schema public to anon, authenticated;
grant insert on public.waitlist to anon, authenticated;
grant insert on public.registrations to anon, authenticated;
grant select on public.waitlist to authenticated;
grant select on public.registrations to authenticated;

-- Verify: Table Editor should show INSERT policies; then retry the brochure form.
