-- Add device_id column to users table
ALTER TABLE public.users ADD COLUMN device_id TEXT;
CREATE INDEX idx_users_device_id ON public.users(device_id);

-- Add device_id to other relevant tables if needed
-- For example, if you want to directly associate actions with devices:
ALTER TABLE public.user_actions ADD COLUMN device_id TEXT;
CREATE INDEX idx_user_actions_device_id ON public.user_actions(device_id);

-- You might want to make device_id NOT NULL for new records
-- but allow NULL for existing records
-- ALTER TABLE public.users ALTER COLUMN device_id SET NOT NULL; 