import { OneSignal } from "react-native-onesignal";

// Function to identify user in OneSignal
export const identifyUserInOneSignal = async (deviceId: string) => {
  try {
    // Set the external user ID in OneSignal
    OneSignal.login(deviceId);
  } catch (error) {
    console.error("Error identifying user in OneSignal:", error);
  }
};
