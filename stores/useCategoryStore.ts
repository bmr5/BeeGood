import { create } from "zustand";
import { Category, CategoryService } from "@/services/category-service";

interface CategoryState {
  // State
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCategories: () => Promise<void>;
  getCategoryById: (id: string) => Category | undefined;
  clearError: () => void;
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  // Initial state
  categories: [],
  isLoading: false,
  error: null,

  // Fetch all categories
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const categories = await CategoryService.getAll();
      set({ categories });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Failed to fetch categories",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Get a category by ID
  getCategoryById: (id: string) => {
    return get().categories.find((category) => category.id === id);
  },

  // Clear any error
  clearError: () => set({ error: null }),
}));
