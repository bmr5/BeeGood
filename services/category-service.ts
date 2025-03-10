import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

// Export types for use in components and state management
export type Category = Tables<"categories">;
export type CategoryInsert = TablesInsert<"categories">;
export type CategoryUpdate = TablesUpdate<"categories">;

/**
 * Service for handling category operations with Supabase
 */
export const CategoryService = {
  /**
   * Get a category by ID
   * @param id Category ID
   * @returns Category object or null if not found
   */
  async getById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching category:", error);
      return null;
    }

    return data;
  },

  /**
   * Get a category by name
   * @param name Category name
   * @returns Category object or null if not found
   */
  async getByName(name: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("name", name)
      .single();

    if (error) {
      console.error("Error fetching category by name:", error);
      return null;
    }

    return data;
  },

  /**
   * Get all categories
   * @returns Array of categories or empty array if error
   */
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching all categories:", error);
      return [];
    }

    return data;
  },

  /**
   * Create a new category
   * @param category Category data to insert
   * @returns Created category or null if error
   */
  async create(category: CategoryInsert): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a category
   * @param id Category ID
   * @param updates Fields to update
   * @returns Updated category or null if error
   */
  async update(id: string, updates: CategoryUpdate): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category:", error);
      return null;
    }

    return data;
  },

  /**
   * Delete a category
   * @param id Category ID
   * @returns True if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      return false;
    }

    return true;
  },

  /**
   * Get categories with action counts
   * @returns Array of categories with action counts or empty array if error
   */
  async getCategoriesWithActionCounts(): Promise<
    (Category & { action_count: number })[]
  > {
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        action_count:actions(count)
      `
      )
      .order("name");

    if (error) {
      console.error("Error fetching categories with action counts:", error);
      return [];
    }

    // Transform the data to get the count as a number
    return data.map((category) => ({
      ...category,
      action_count: category.action_count?.[0]?.count || 0,
    }));
  },

  /**
   * Get categories with their associated actions
   * @returns Array of categories with actions or empty array if error
   */
  async getCategoriesWithActions(): Promise<(Category & { actions: any[] })[]> {
    const { data, error } = await supabase
      .from("categories")
      .select(
        `
        *,
        actions(*)
      `
      )
      .order("name");

    if (error) {
      console.error("Error fetching categories with actions:", error);
      return [];
    }

    return data;
  },

  /**
   * Update category color
   * @param id Category ID
   * @param color New color code
   * @returns Updated category or null if error
   */
  async updateColor(id: string, color: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .update({ color })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category color:", error);
      return null;
    }

    return data;
  },

  /**
   * Update category icon
   * @param id Category ID
   * @param icon New icon name
   * @returns Updated category or null if error
   */
  async updateIcon(id: string, icon: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .update({ icon })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating category icon:", error);
      return null;
    }

    return data;
  },
};
