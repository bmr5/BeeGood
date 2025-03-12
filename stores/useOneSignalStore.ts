import { create } from "zustand";
import { Platform } from "react-native";
import { OneSignal } from "react-native-onesignal";

interface OneSignalState {
  // Permission status
  hasPermission: boolean;

  // Subscription status
  isOptedIn: boolean;

  // Simple setters
  setPermission: (hasPermission: boolean) => void;
  setIsOptedIn: (isOptedIn: boolean) => void;

  // Initialize with current status
  initialize: () => void;
}

export const useOneSignalStore = create<OneSignalState>((set) => ({
  hasPermission: false,
  isOptedIn: false,

  setPermission: (hasPermission) => {
    set({ hasPermission });
  },

  setIsOptedIn: (isOptedIn) => {
    set({ isOptedIn });
  },

  initialize: () => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") {
      return;
    }

    try {
      // Get initial permission status
      OneSignal.Notifications.getPermissionAsync().then((hasPermission) => {
        set({ hasPermission });
      });

      // Get initial subscription status
      OneSignal.User.pushSubscription.getOptedInAsync().then((isOptedIn) => {
        set({ isOptedIn });
      });
    } catch (error) {
      console.error("Error initializing OneSignal store:", error);
    }
  },
}));
