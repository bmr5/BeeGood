// Function to get device ID on iOS
function getDeviceID(): string {
  // For React Native on iOS
  if (typeof global !== "undefined" && (global as any).__DEV__) {
    try {
      // Try to dynamically import react-native-device-info
      let DeviceInfo;
      try {
        DeviceInfo = require("react-native-device-info");
        if (DeviceInfo && typeof DeviceInfo.getUniqueId === "function") {
          return DeviceInfo.getUniqueId();
        }
      } catch (e) {
        console.warn(
          "Could not import react-native-device-info, falling back to alternative methods"
        );
      }

      // Try to use Expo's device ID if available
      try {
        const ExpoApplication = require("expo-application");
        if (
          ExpoApplication &&
          typeof ExpoApplication.getIosIdForVendorAsync === "function"
        ) {
          return ExpoApplication.getIosIdForVendorAsync();
        }
      } catch (e) {
        console.warn("Could not use expo-application for device ID");
      }

      // Fallback to a random ID for development
      return `ios-dev-${Math.random().toString(36).substring(2, 15)}`;
    } catch (e) {
      console.warn("Error getting device ID:", e);

      // Fallback to a random ID for development
      return `ios-dev-${Math.random().toString(36).substring(2, 15)}`;
    }
  }

  // For native iOS using Expo
  if (typeof global !== "undefined" && (global as any).expo) {
    try {
      // @ts-ignore - Expo specific
      const { getIosIdForVendorAsync } = require("expo-application");
      // This is async, but we're wrapping the whole function in async anyway
      return getIosIdForVendorAsync();
    } catch (e) {
      console.warn("Could not get device ID using expo-application:", e);
    }
  }

  // Fallback for web testing or if other methods fail
  return `ios-fallback-${Math.random().toString(36).substring(2, 15)}`;
}

async function registerDeviceForDevelopment() {
  const deviceId = getDeviceID();
  console.log("Your device ID is:", deviceId);

  // You can now manually add this to your seed.sql
  // Or use a development-only endpoint to register it

  //   const { data, error } = await supabase.from("users").upsert({
  //     email: "your-dev-email@example.com",
  //     username: "dev-user",
  //     device_id: deviceId,
  //     onboarding_completed: true,
  //   });

  //   if (error) console.error("Error registering device:", error);
  //   else console.log("Device registered successfully:", data);
}

export default registerDeviceForDevelopment;
