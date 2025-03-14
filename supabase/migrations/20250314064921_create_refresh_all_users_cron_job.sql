-- Migration: Create cron job for nightly refresh of all user actions
-- Description: This migration sets up a scheduled job to trigger the refresh-all-user-actions
-- edge function every night at 2am CST (8am UTC).
-- Date: 2025-03-14

-- Create a cron job to run at 2am CST (8am UTC) every day
select
  cron.schedule(
    'refresh-all-user-actions-nightly', -- job name
    '0 8 * * *',                       -- cron expression: run at 8am UTC (2am CST) every day
    $$
    select
      net.http_post(
        url:='https://' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_url') || '/functions/v1/refresh-all-user-actions',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
        ),
        body:=jsonb_build_object('scheduled', true),
        timeout_milliseconds:=60000
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