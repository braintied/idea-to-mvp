-- The CRM: waitlist signups, contacts, and notes.
-- Every contact and note belongs to the signed-in user who created it.
-- Row-level security (RLS) makes the database itself refuse to show
-- one person's rows to anyone else, even if the app has a bug.

-- Waitlist: filled by the public website form. Only the server
-- (using the secret key) can read or write it.
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (position('@' in email) > 1),
  name text,
  created_at timestamptz not null default now(),
  added_to_crm_at timestamptz
);

alter table public.waitlist enable row level security;
-- No policies on purpose: browsers can't touch this table at all.

-- Contacts: the people you are building relationships with.
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(name) between 1 and 200),
  email text,
  company text,
  stage text not null default 'lead'
    check (stage in ('lead', 'talking', 'customer', 'partner', 'archived')),
  last_contacted_at timestamptz,
  created_at timestamptz not null default now()
);

create index contacts_user_id_idx on public.contacts (user_id, created_at desc);

alter table public.contacts enable row level security;

create policy "Users manage their own contacts"
  on public.contacts for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Notes: the timeline of everything that happened with a contact.
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  body text not null check (length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);

create index notes_contact_id_idx on public.notes (contact_id, created_at desc);

alter table public.notes enable row level security;

create policy "Users manage their own notes"
  on public.notes for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.contacts c
      where c.id = contact_id and c.user_id = (select auth.uid())
    )
  );
