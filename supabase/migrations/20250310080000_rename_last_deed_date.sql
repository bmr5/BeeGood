-- Rename last_deed_date to last_action_date in users table
ALTER TABLE public.users RENAME COLUMN last_deed_date TO last_action_date;

-- Update any views or functions that might reference this column
-- For example, if you have a view that uses last_deed_date:
-- CREATE OR REPLACE VIEW user_activity_view AS
-- SELECT id, username, last_action_date FROM users; 