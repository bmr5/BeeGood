import { create } from "zustand";
import { Action, ActionService } from "@/services/action-service";
import { UserActionService } from "@/services/user-action-service";

interface ActionState {
  // State
  actions: Action[];
  todaysActions: Action[];
  todaysUserActions: any[];
  popularActions: Action[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActions: () => Promise<void>;
  fetchTodaysActions: (userId: string) => Promise<void>;
  fetchPopularActions: (limit?: number) => Promise<void>;
  fetchActionsByCategory: (categoryId: string) => Promise<void>;
  getActionById: (id: string) => Action | undefined;
  clearError: () => void;
}

export const useActionStore = create<ActionState>()((set, get) => ({
  // Initial state
  actions: [],
  todaysActions: [],
  todaysUserActions: [],
  popularActions: [],
  isLoading: false,
  error: null,

  // Fetch all actions
  fetchActions: async () => {
    try {
      set({ isLoading: true, error: null });
      const actions = await ActionService.getAll();
      set({ actions });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch actions",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch today's actions for a user
  fetchTodaysActions: async (userId: string) => {
    try {
      set({ isLoading: true, error: null });

      // Use UserActionService to get today's actions with details
      const userActions = await UserActionService.getTodaysActionsWithDetails(
        userId
      );

      // Extract the action objects from the user actions
      const actions = userActions.map((ua) => ua.action);

      set({
        todaysActions: actions,
        todaysUserActions: userActions,
      });
    } catch (e) {
      set({
        error:
          e instanceof Error ? e.message : "Failed to fetch today's actions",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch popular actions
  fetchPopularActions: async (limit = 10) => {
    try {
      set({ isLoading: true, error: null });
      const actions = await ActionService.getPopular(limit);
      set({ popularActions: actions });
    } catch (e) {
      set({
        error:
          e instanceof Error ? e.message : "Failed to fetch popular actions",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch actions by category
  fetchActionsByCategory: async (categoryId: string) => {
    try {
      set({ isLoading: true, error: null });
      const actions = await ActionService.getByCategoryId(categoryId);
      set({ actions });
    } catch (e) {
      set({
        error:
          e instanceof Error
            ? e.message
            : "Failed to fetch actions by category",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Get an action by ID
  getActionById: (id: string) => {
    return get().actions.find((action) => action.id === id);
  },

  // Clear any error
  clearError: () => set({ error: null }),
}));
