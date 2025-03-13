-- Migration: Create user_actions_history table for archiving older completed/skipped actions
-- Description: Implements a historical table to store older actions, optimizing the main user_actions table
-- Date: 2025-03-12

-- Create the history table with identical structure to the main table
create table public.user_actions_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references public.users(id) on delete cascade,
    action_id uuid references public.actions(id) on delete cascade,
    completed boolean default false,
    skipped boolean default false,
    completion_date timestamp with time zone null,
    assigned_date date not null,
    notes text null,
    created_at timestamp with time zone default now(),
    -- Additional fields for history tracking
    archived_at timestamp with time zone default now()
);

comment on table public.user_actions_history is 'Archives older completed/skipped actions from the main user_actions table';

-- Create index optimized for historical queries
create index idx_history_user_date on public.user_actions_history(user_id, assigned_date);

-- Create additional indexes for common query patterns
create index idx_history_completion_date on public.user_actions_history(completion_date);
create index idx_history_action_id on public.user_actions_history(action_id);

-- Enable Row Level Security
alter table public.user_actions_history enable row level security;

-- Create RLS policies for authenticated users
-- Note: These policies are set to restrict access to only the user's own data

-- Policy for selecting records
create policy "Users can view their own action history"
on public.user_actions_history
for select
to authenticated
using ((select auth.uid()) = user_id);

-- Policy for inserting records (typically done by system/admin, but restricting to own records)
create policy "Users can insert their own action history"
on public.user_actions_history
for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- Policy for updating records (typically not needed for history but added for completeness)
create policy "Users can update their own action history"
on public.user_actions_history
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Policy for deleting records (typically not needed for history but added for completeness)
create policy "Users can delete their own action history"
on public.user_actions_history
for delete
to authenticated
using ((select auth.uid()) = user_id); 