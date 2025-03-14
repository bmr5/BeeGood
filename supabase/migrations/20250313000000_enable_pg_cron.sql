-- Migration: Enable pg_cron extension
-- Description: This migration enables the pg_cron extension and grants necessary permissions
-- to the postgres role to manage scheduled jobs. It also enables the pg_net extension
-- to allow making HTTP requests to edge functions.
-- Date: 2025-03-13

-- Drop existing extensions if they exist
drop extension if exists pg_cron;
drop extension if exists pg_net;

-- Enable pg_cron extension in the pg_catalog schema
create extension pg_cron with schema pg_catalog;

-- Grant usage on the cron schema to postgres role
grant usage on schema cron to postgres;

-- Grant all privileges on all tables in the cron schema to postgres role
grant all privileges on all tables in schema cron to postgres;

-- Enable the pg_net extension for making HTTP requests
create extension pg_net;

-- Note: The pg_net extension creates its own schema/namespace named "net" to avoid naming conflicts.
-- We don't need to drop and recreate it as mentioned in the example, as we're enabling it for use.