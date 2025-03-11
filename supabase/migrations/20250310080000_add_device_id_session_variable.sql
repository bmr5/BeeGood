-- Create a function to set the current user ID based on device ID
CREATE OR REPLACE FUNCTION set_user_id_from_device_id()
RETURNS void AS $$
DECLARE
  device_id_var text;
  user_id uuid;
BEGIN
  -- Get the device ID from the request header
  device_id_var := current_setting('request.headers', true)::json->>'x-device-id';
  
  -- If device ID is present, look up the corresponding user ID
  IF device_id_var IS NOT NULL AND device_id_var != '' THEN
    SELECT id INTO user_id FROM public.users WHERE device_id = device_id_var LIMIT 1;
    
    -- Set the session variable if user was found
    IF user_id IS NOT NULL THEN
      PERFORM set_config('app.current_user_id', user_id::text, false);
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get the current user ID (for testing)
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS jsonb AS $$
DECLARE
  current_user_id text;
  device_id_var text;
  all_headers json;
  user_count int;
BEGIN
  -- Get all request headers for debugging
  BEGIN
    all_headers := current_setting('request.headers', true)::json;
  EXCEPTION WHEN OTHERS THEN
    all_headers := null;
  END;
  
  -- Get the device ID from request headers
  BEGIN
    device_id_var := all_headers->>'x-device-id';
  EXCEPTION WHEN OTHERS THEN
    device_id_var := null;
  END;
  
  -- First call the function to set the user ID
  PERFORM set_user_id_from_device_id();
  
  -- Try to get the current user ID from session
  BEGIN
    current_user_id := current_setting('app.current_user_id', true);
  EXCEPTION WHEN OTHERS THEN
    current_user_id := null;
  END;
  
  -- Check if a user exists with this device ID
  SELECT COUNT(*) INTO user_count 
  FROM public.users 
  WHERE device_id = device_id_var;
  
  -- Return all values for debugging
  RETURN jsonb_build_object(
    'current_user_id', current_user_id,
    'device_id', device_id_var,
    'all_headers', all_headers,
    'user_count', user_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the anon and authenticated roles
GRANT EXECUTE ON FUNCTION set_user_id_from_device_id() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_current_user_id() TO anon, authenticated;

-- Create a wrapper function for common tables
CREATE OR REPLACE FUNCTION current_user_id() 
RETURNS uuid AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Call the function to set the user ID
  PERFORM set_user_id_from_device_id();
  
  -- Get the user ID from the session variable
  BEGIN
    user_id := (current_setting('app.current_user_id', true))::uuid;
    RETURN user_id;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the anon and authenticated roles
GRANT EXECUTE ON FUNCTION current_user_id() TO anon, authenticated; 