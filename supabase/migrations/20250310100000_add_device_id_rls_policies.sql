-- Enable Row Level Security on all tables
alter table public.users enable row level security;
alter table public.user_profiles enable row level security;
alter table public.user_actions enable row level security;
alter table public.user_stats enable row level security;

-- RLS policies for users table

-- Select policy for users table
create policy "Users can view their own data"
on public.users
for select
to authenticated, anon
using (
  public.belongs_to_current_device(device_id)
);

-- Insert policy for users table
create policy "Users can insert their own data"
on public.users
for insert
to authenticated, anon
with check (
  public.belongs_to_current_device(device_id)
);

-- Update policy for users table
create policy "Users can update their own data"
on public.users
for update
to authenticated, anon
using (
  public.belongs_to_current_device(device_id)
)
with check (
  public.belongs_to_current_device(device_id)
);

-- Delete policy for users table
create policy "Users can delete their own data"
on public.users
for delete
to authenticated, anon
using (
  public.belongs_to_current_device(device_id)
);

-- RLS policies for user_profiles table

-- Select policy for user_profiles table
create policy "Users can view their own profiles"
on public.user_profiles
for select
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
);

-- Insert policy for user_profiles table
create policy "Users can insert their own profiles"
on public.user_profiles
for insert
to authenticated, anon
with check (
  user_id = public.get_user_id_from_device_id()
);

-- Update policy for user_profiles table
create policy "Users can update their own profiles"
on public.user_profiles
for update
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
)
with check (
  user_id = public.get_user_id_from_device_id()
);

-- Delete policy for user_profiles table
create policy "Users can delete their own profiles"
on public.user_profiles
for delete
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
);

-- RLS policies for user_actions table

-- Select policy for user_actions table
create policy "Users can view their own actions"
on public.user_actions
for select
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
);

-- Insert policy for user_actions table
create policy "Users can insert their own actions"
on public.user_actions
for insert
to authenticated, anon
with check (
  user_id = public.get_user_id_from_device_id()
);

-- Update policy for user_actions table
create policy "Users can update their own actions"
on public.user_actions
for update
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
)
with check (
  user_id = public.get_user_id_from_device_id()
);

-- Delete policy for user_actions table
create policy "Users can delete their own actions"
on public.user_actions
for delete
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
);

-- RLS policies for user_stats table

-- Select policy for user_stats table
create policy "Users can view their own stats"
on public.user_stats
for select
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
);

-- Insert policy for user_stats table
create policy "Users can insert their own stats"
on public.user_stats
for insert
to authenticated, anon
with check (
  user_id = public.get_user_id_from_device_id()
);

-- Update policy for user_stats table
create policy "Users can update their own stats"
on public.user_stats
for update
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
)
with check (
  user_id = public.get_user_id_from_device_id()
);

-- Delete policy for user_stats table
create policy "Users can delete their own stats"
on public.user_stats
for delete
to authenticated, anon
using (
  user_id = public.get_user_id_from_device_id()
);

-- Allow public access to categories and actions tables
alter table public.categories enable row level security;
alter table public.actions enable row level security;

-- Public read access to categories
create policy "Categories are viewable by everyone"
on public.categories
for select
to authenticated, anon
using (true);

-- Public read access to actions
create policy "Actions are viewable by everyone"
on public.actions
for select
to authenticated, anon
using (true); 