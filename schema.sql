-- Create the contact_messages table
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  ip_address text -- optional: for rate limiting/auditing
);

-- Enable Row Level Security (RLS)
alter table public.contact_messages enable row level security;

-- Policy: Only authenticated admins can read messages
-- Assuming you have an admin role or specific user ID
-- For now, we can restrict read access to service_role only (backend)
create policy "Enable read access for service role only"
  on public.contact_messages
  for select
  to service_role
  using (true);

-- Policy: Anyone can insert (public contact form)
create policy "Enable insert for public"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);
