import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserService } from "@/services/user-service";
import {
  UserProfile,
  UserProfileService,
} from "@/services/user-profile-service";

interface UserState {
  // State
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadUser: (userId: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      userProfile: null,
      isLoading: false,
      error: null,

      // Load user data from services
      loadUser: async (userId: string) => {
        try {
          set({ isLoading: true, error: null });

          const userData = await UserService.getById(userId);

          if (userData) {
            const profileData = await UserProfileService.getByUserId(
              userData.id
            );
            set({ user: userData, userProfile: profileData });
          } else {
            set({ error: "User not found" });
          }
        } catch (e) {
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
      }),
    }
  )
);
