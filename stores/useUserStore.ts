import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserService } from "@/services/user-service";
import {
  UserProfile,
  UserProfileService,
} from "@/services/user-profile-service";
import { setupDeviceUser } from "@/lib/setupDeviceUser";

interface UserState {
  // State
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  deviceId: string | null;

  // Actions
  loadUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  clearError: () => void;
  initializeDeviceUser: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userProfile: null,
      isLoading: false,
      error: null,
      deviceId: null,

      // Initialize device user
      initializeDeviceUser: async () => {
        try {
          set({ isLoading: true, error: null });

          // Get or create device ID and user
          const deviceId = await setupDeviceUser();
          set({ deviceId });

          // Get the user data for this device
          const userData = await UserService.getByDeviceId(deviceId);

          if (userData) {
            // Load the full user data including profile
            await get().loadUser(userData.id);
          } else {
            set({ error: "Failed to find user for this device" });
          }
        } catch (e) {
          set({
            error:
              e instanceof Error
                ? e.message
                : "Failed to initialize device user",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Load user data from services
      loadUser: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });

          const userData = await UserService.getById(userId);

          if (userData) {
            try {
              const profileData = await UserProfileService.getByUserId(
                userData.id
              );
              set({ user: userData, userProfile: profileData });
            } catch (profileError) {
              console.error("Error loading user profile:", profileError);
              // Still set the user data even if profile loading fails
              set({
                user: userData,
                userProfile: null,
                error:
                  "Failed to load user profile, but user data is available",
              });
            }
          } else {
            set({ error: "User not found" });
          }
        } catch (e) {
          console.error("Error in loadUser:", e);
          set({
            error: e instanceof Error ? e.message : "Failed to load user data",
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Refresh current user data
      refreshUser: async () => {
        const { user } = get();
        if (user) {
          await get().loadUser(user.id);
        }
      },

      // Clear user data
      clearUser: () => {
        set({ user: null, userProfile: null });
      },

      // Clear any error
      clearError: () => set({ error: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        userProfile: state.userProfile,
        deviceId: state.deviceId,
      }),
    }
  )
);
