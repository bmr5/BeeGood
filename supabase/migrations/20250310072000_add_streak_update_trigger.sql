-- Add a trigger function to update user streak count when an action is completed
create or replace function public.update_user_streak()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  last_action_date date;
  current_streak integer;
  today date := current_date;
begin
  -- This function runs when a user_action is marked as completed
  -- We only care about the case where completed changes from false to true
  if (TG_OP = 'UPDATE' AND old.completed = false AND new.completed = true) then
    -- Get the user's current streak information
    select u.streak_count, u.last_action_date
    into current_streak, last_action_date
    from public.users u
    where u.id = new.user_id;
    
    -- Update the streak count based on the last action date
    if last_action_date is null then
      -- First completed action ever
      current_streak := 1;
    elsif last_action_date = today - interval '1 day' then
      -- Consecutive day, increment streak
      current_streak := current_streak + 1;
    elsif last_action_date < today - interval '1 day' then
      -- Streak broken, start a new streak
      current_streak := 1;
    elsif last_action_date = today then
      -- Already completed an action today, keep the same streak
      -- but we still need to update the last_action_date
      current_streak := current_streak;
    end if;
    
    -- Update the user's streak count and last action date
    update public.users
    set 
      streak_count = current_streak,
      last_action_date = today
    where id = new.user_id;
    
    -- Log the streak update for debugging
    raise notice 'Updated streak for user %: new streak is % (last action date: %)', 
      new.user_id, current_streak, today;
  end if;
  
  return new;
end;
$$;

-- Create a trigger on the user_actions table
create trigger update_streak_on_action_completion
after update on public.user_actions
for each row
execute function public.update_user_streak();

-- Add a comment explaining the trigger
comment on function public.update_user_streak() is 'Updates the user streak count when an action is marked as completed'; 