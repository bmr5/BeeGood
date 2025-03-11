import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

// Call this on app startup
export async function setupDeviceUser() {
  // Check if we're in development mode
  const isDev = __DEV__ || Constants.expoConfig?.extra?.env === "development";
  console.log(`Environment: ${isDev ? "Development" : "Production"}`);

  // Development device IDs that match our seeded users
  const devDeviceIds = {
    ben: "ben-device-123",
    nick: "nick-device-789",
    unSeeded: "unseeded-device-123",
  };

  // Default to Ben's device ID in development
  const defaultDevDeviceId = devDeviceIds.ben;

  // Try to get stored device ID
  let deviceId = await AsyncStorage.getItem("deviceId");
  console.log("Device ID from storage:", deviceId);

  // In development mode, always use the predefined device ID
  if (isDev) {
    // Use the unseeded device ID instead of the default
    deviceId = defaultDevDeviceId;
    await AsyncStorage.setItem("deviceId", deviceId);
  }
  // For production or if no device ID exists
  else if (!deviceId) {
    deviceId = `device-${Math.random().toString(36).substring(2, 15)}`;
    await AsyncStorage.setItem("deviceId", deviceId);
  }

  // Create a temporary Supabase client with the device ID
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

  const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        "x-device-id": deviceId,
      },
    },
  });

  // Check if a user exists with this device ID
  const { data, error } = await tempClient
    .from("users")
    .select("id")
    .eq("device_id", deviceId);

  // If no user exists or there was an error, create one
  if (error || !data || data.length === 0) {
    const newUser = {
      device_id: deviceId,
      username: `user-${deviceId.substring(0, 8)}`,
      onboarding_completed: false,
    };

    await tempClient.from("users").insert(newUser);
    console.log(`Created new user with device ID: ${deviceId}`);
  } else {
    console.log(`Found existing user with device ID: ${deviceId}`);
  }

  return deviceId;
}
