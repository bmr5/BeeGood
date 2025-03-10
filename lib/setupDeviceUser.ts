import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
import Constants from "expo-constants";

// Call this on app startup
export async function setupDeviceUser() {
  // Check if we're in development mode
  const isDev = __DEV__ || Constants.expoConfig?.extra?.env === "development";
  console.log(`Environment: ${isDev ? "Development" : "Production"}`);

  // Development device IDs that match our seeded users
  const devDeviceIds = {
    ben: "ben-device-123",
    nick: "nick-device-789",
  };

  // Default to Ben's device ID in development
  const defaultDevDeviceId = devDeviceIds.ben;

  // Try to get stored device ID
  let deviceId = await AsyncStorage.getItem("deviceId");

  // In development mode, always use the predefined device ID
  // This ensures we're always using a seeded user in development
  if (isDev) {
    // Force use of the development device ID
    deviceId = defaultDevDeviceId;

    // Uncomment to use Nick's account instead
    // deviceId = devDeviceIds.nick;

    // Store it to ensure consistency
    await AsyncStorage.setItem("deviceId", deviceId);
  }
  // For production or if no device ID exists
  else if (!deviceId) {
    // Generate a random device ID for production
    deviceId = `device-${Math.random().toString(36).substring(2, 15)}`;
    await AsyncStorage.setItem("deviceId", deviceId);
  }

  // Check if a user exists with this device ID
  const { data } = await supabase
    .from("users")
    .select("id")
    .eq("device_id", deviceId)
    .single();

  // If no user exists, create one
  if (!data) {
    // Create a new user with this device ID
    const newUser = {
      device_id: deviceId,
      username: `user-${deviceId.substring(0, 8)}`,
      onboarding_completed: false,
    };

    await supabase.from("users").insert(newUser);
    console.log(`Created new user with device ID: ${deviceId}`);
  } else {
    console.log(`Found existing user with device ID: ${deviceId}`);
  }

  return deviceId;
}
