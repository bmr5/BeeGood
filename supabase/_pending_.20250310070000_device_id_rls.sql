-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for the users table
-- Devices can read their own user record
CREATE POLICY "Devices can read own user record" ON public.users
    FOR SELECT
    USING (device_id = current_setting('request.headers')::json->>'x-device-id');

-- Devices can update their own user record
CREATE POLICY "Devices can update own user record" ON public.users
    FOR UPDATE
    USING (device_id = current_setting('request.headers')::json->>'x-device-id');

-- Devices can insert their own user record
CREATE POLICY "Devices can insert own user record" ON public.users
    FOR INSERT
    WITH CHECK (device_id = current_setting('request.headers')::json->>'x-device-id');

-- Create policies for user_profiles table
CREATE POLICY "Devices can read own user profiles" ON public.user_profiles
    FOR SELECT
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can insert own user profiles" ON public.user_profiles
    FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can update own user profiles" ON public.user_profiles
    FOR UPDATE
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

-- Create policies for user_actions table
CREATE POLICY "Devices can read own user actions" ON public.user_actions
    FOR SELECT
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can insert own user actions" ON public.user_actions
    FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can update own user actions" ON public.user_actions
    FOR UPDATE
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can delete own user actions" ON public.user_actions
    FOR DELETE
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

-- Create policies for user_stats table
CREATE POLICY "Devices can read own user stats" ON public.user_stats
    FOR SELECT
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can insert own user stats" ON public.user_stats
    FOR INSERT
    WITH CHECK (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    ));

CREATE POLICY "Devices can update own user stats" ON public.user_stats
    FOR UPDATE
    USING (user_id IN (
        SELECT id FROM public.users 
        WHERE device_id = current_setting('request.headers')::json->>'x-device-id'
    )); 