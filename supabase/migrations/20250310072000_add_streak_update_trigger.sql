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
  user_timezone text;
  today date;
  has_other_completed_actions boolean;
begin
  -- Get the user's timezone
  select timezone into user_timezone from public.users where id = new.user_id;
  
  -- Default to UTC if no timezone set
  if user_timezone is null then
    user_timezone := 'UTC';
  end if;
  
  -- Calculate today's date in the user's timezone
  today := (current_timestamp at time zone user_timezone)::date;
  
  -- This function handles both completion and un-completion of actions
  
  -- Case 1: Action is being marked as completed
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
    raise notice 'Updated streak for user %: new streak is % (last action date: % in timezone %)', 
      new.user_id, current_streak, today, user_timezone;
  
  -- Case 2: Action is being marked as uncompleted
  elsif (TG_OP = 'UPDATE' AND old.completed = true AND new.completed = false) then
    -- Check if the user has any other completed actions for today in their timezone
    select exists(
      select 1 
      from public.user_actions 
      where user_id = new.user_id 
        and completed = true 
        and id != new.id
        and date_trunc('day', completion_date at time zone user_timezone) = date_trunc('day', current_timestamp at time zone user_timezone)
    ) into has_other_completed_actions;
    
    -- Only update if this was the only completed action for today
    if not has_other_completed_actions then
      -- Get the user's current streak information
      select u.streak_count, u.last_action_date
      into current_streak, last_action_date
      from public.users u
      where u.id = new.user_id;
      
      -- Only decrement if this action was completed today and affected today's streak
      if last_action_date = today then
        -- Find the previous action date before today in user's timezone
        select max(date_trunc('day', completion_date at time zone user_timezone))::date
        into last_action_date
        from public.user_actions
        where user_id = new.user_id
          and completed = true
          and date_trunc('day', completion_date at time zone user_timezone) < date_trunc('day', current_timestamp at time zone user_timezone);
        
        -- If there was a previous action, set streak based on that date
        if last_action_date is not null then
          if last_action_date = today - interval '1 day' then
            -- Yesterday's action exists, so streak is at least 1
            current_streak := current_streak - 1;
            if current_streak < 1 then current_streak := 1; end if;
          else
            -- Previous action was not yesterday, reset streak to 0
            current_streak := 0;
          end if;
          
          -- Update the user's streak count and last action date
          update public.users
          set 
            streak_count = current_streak,
            last_action_date = last_action_date
          where id = new.user_id;
        else
          -- No previous actions, reset streak to 0
          update public.users
          set 
            streak_count = 0,
            last_action_date = null
          where id = new.user_id;
        end if;
        
        -- Log the streak update for debugging
        raise notice 'Decremented streak for user %: new streak is % (last action date: % in timezone %)', 
          new.user_id, current_streak, last_action_date, user_timezone;
      end if;
    end if;
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
comment on function public.update_user_streak() is 'Updates the user streak count when an action is marked as completed based on the user''s timezone'; 