-- Create a helper function to check if a record belongs to the current device
create or replace function public.belongs_to_current_device(record_device_id text)
returns boolean
language plpgsql
security invoker
as $$
declare
  current_device_id text;
begin
  -- Get the device ID from the request header
  begin
    current_device_id := current_setting('request.headers', true)::json->>'x-device-id';
  exception
    when others then
      current_device_id := null;
  end;
  
  -- Check if the record's device ID matches the current device ID
  return record_device_id = current_device_id;
end;
$$;

-- Grant execute permission on the helper function
grant execute on function public.belongs_to_current_device(text) to authenticated, anon;

-- Create a helper function to get user_id from device_id
create or replace function public.get_user_id_from_device_id()
returns uuid
language plpgsql
security invoker
as $$
declare
  device_id_var text;
  user_id_var uuid;
begin
  -- Get the device ID from the request header
  begin
    device_id_var := current_setting('request.headers', true)::json->>'x-device-id';
  exception
    when others then
      device_id_var := null;
  end;
  
  -- Look up the user ID for this device ID
  if device_id_var is not null then
    select id into user_id_var
    from public.users
    where device_id = device_id_var
    limit 1;
  end if;
  
  return user_id_var;
end;
$$;

-- Grant execute permission on the helper function
grant execute on function public.get_user_id_from_device_id() to authenticated, anon;

-- Comment on functions
comment on function public.belongs_to_current_device(text) is 'Checks if the provided device ID matches the current device ID from the request headers';
comment on function public.get_user_id_from_device_id() is 'Returns the user ID associated with the device ID from the request headers';