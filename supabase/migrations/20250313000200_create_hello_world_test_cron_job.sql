-- Migration: Create test cron job for hello-world function
-- Description: This migration sets up a test job to trigger the hello-world
-- edge function every minute to verify that the cron setup is working correctly.
-- Date: 2025-03-13

-- Create a cron job to run every minute to test the cron setup
select
  cron.schedule(
    'hello-world-test', -- job name
    '* * * * *',        -- cron expression: run every minute
    $$
    select
      net.http_post(
        url:='https://' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_url') || '/functions/v1/hello-world',
        headers:=jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
        ),
        body:=jsonb_build_object('test', true, 'timestamp', now()),
        timeout_milliseconds:=5000
      ) as request_id;
    $$
  );

-- Note: This is a test job that runs every minute. In production, you might want to 
-- disable or remove this job to avoid unnecessary function invocations.
-- You can disable it with: SELECT cron.unschedule('hello-world-test');
--
-- This migration uses vault secrets to securely store sensitive information.
-- Make sure you have added the following to your supabase/config.toml:
-- [db.vault]
-- SUPABASE_URL = "env(SUPABASE_URL)"
-- SUPABASE_ANON_KEY = "env(SUPABASE_ANON_KEY)"
--
-- And in your .env.local file:
-- SUPABASE_URL="your-project-ref"
-- SUPABASE_ANON_KEY="your-anon-key" 