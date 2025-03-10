import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";

// Call this on app startup
async function setupDeviceUser() {
  // Try to get stored device ID
  let deviceId = await AsyncStorage.getItem("deviceId");

  // If no device ID exists, create one and store it
  if (!deviceId) {
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
    await supabase.from("users").insert({
      device_id: deviceId,
      username: `user-${deviceId.substring(0, 8)}`,
      onboarding_completed: false,
    });
  }

  // Set the device ID header for all future requests
  supabase.headers["x-device-id"] = deviceId;

  return deviceId;
}
