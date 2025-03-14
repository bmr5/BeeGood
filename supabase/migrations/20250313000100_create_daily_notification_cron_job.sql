-- Migration: Create cron job for daily action notifications
-- Description: This migration sets up a scheduled job to trigger the send-daily-action-notifications
-- edge function every hour to handle notifications in different time zones.
-- Date: 2025-03-13

-- Create a cron job to run every hour to handle notifications across different time zones
select
  cron.schedule(
    'send-daily-action-notifications', -- job name
    '0 * * * *',                      -- cron expression: run at the top of every hour
    $$
    select
      net.http_post(
        url:='https://' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_url') || '/functions/v1/send-daily-action-notifications',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
        ),
        body:=jsonb_build_object('scheduled', true),
        timeout_milliseconds:=30000
      ) as request_id;
    $$
  );

-- This migration uses vault secrets to securely store sensitive information.
-- Make sure you have added the following to your supabase/config.toml:
-- [db.vault]
-- SUPABASE_URL = "env(SUPABASE_URL)"
-- SUPABASE_ANON_KEY = "env(SUPABASE_ANON_KEY)"
--
-- And in your .env.local file:
-- SUPABASE_URL="your-project-ref"
-- SUPABASE_ANON_KEY="your-anon-key" 