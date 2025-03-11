-- ===================================================================
-- Migration: Enable Supabase Realtime Subscriptions
-- ===================================================================
-- Purpose: Enable realtime subscriptions for tables that are editable by users
-- Affected tables: users, user_profiles, user_actions, user_stats
-- ===================================================================

-- Check if the supabase_realtime publication already exists
-- If it doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
    ) THEN
        -- Create the publication for realtime if it doesn't exist
        CREATE PUBLICATION supabase_realtime;
    END IF;
END
$$;

-- Add tables to the supabase_realtime publication
-- These tables will be available for realtime subscriptions

-- Add users table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- Add user_profiles table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;

-- Add user_actions table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_actions;

-- Add user_stats table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;

-- Note: The actions and categories tables are not added to realtime
-- because they are meant to be read-only for users and don't require
-- realtime updates since they don't change frequently