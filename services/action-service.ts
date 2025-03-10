import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

// Export types for use in components and state management
export type Action = Tables<"actions">;
export type ActionInsert = TablesInsert<"actions">;
export type ActionUpdate = TablesUpdate<"actions">;

/**
 * Service for handling action operations with Supabase
 */
export const ActionService = {
  /**
   * Get an action by ID
   * @param id Action ID
   * @returns Action object or null if not found
   */
  async getById(id: string): Promise<Action | null> {
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching action:", error);
      return null;
    }

    return data;
  },

  /**
   * Get all actions
   * @returns Array of actions or empty array if error
   */
  async getAll(): Promise<Action[]> {
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .order("title");

    if (error) {
      console.error("Error fetching all actions:", error);
      return [];
    }

    return data;
  },

  /**
   * Get actions by category ID
   * @param categoryId Category ID
   * @returns Array of actions or empty array if error
   */
  async getByCategoryId(categoryId: string): Promise<Action[]> {
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .eq("category_id", categoryId)
      .order("title");

    if (error) {
      console.error("Error fetching actions by category:", error);
      return [];
    }

    return data;
  },

  /**
   * Get actions with their category information
   * @returns Array of actions with category info or empty array if error
   */
  async getWithCategory(): Promise<(Action & { category: any })[]> {
    const { data, error } = await supabase
      .from("actions")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .order("title");

    if (error) {
      console.error("Error fetching actions with category:", error);
      return [];
    }

    return data;
  },

  /**
   * Get custom actions created by a specific user
   * @param userId User ID
   * @returns Array of custom actions or empty array if error
   */
  async getCustomByUserId(userId: string): Promise<Action[]> {
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .eq("is_custom", true)
      .filter(
        "id",
        "in",
        supabase.from("user_actions").select("action_id").eq("user_id", userId)
      )
      .order("title");

    if (error) {
      console.error("Error fetching custom actions by user:", error);
      return [];
    }

    return data;
  },

  /**
   * Create a new action
   * @param action Action data to insert
   * @returns Created action or null if error
   */
  async create(action: ActionInsert): Promise<Action | null> {
    const { data, error } = await supabase
      .from("actions")
      .insert(action)
      .select()
      .single();

    if (error) {
      console.error("Error creating action:", error);
      return null;
    }

    return data;
  },

  /**
   * Update an action
   * @param id Action ID
   * @param updates Fields to update
   * @returns Updated action or null if error
   */
  async update(id: string, updates: ActionUpdate): Promise<Action | null> {
    const { data, error } = await supabase
      .from("actions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating action:", error);
      return null;
    }

    return data;
  },

  /**
   * Delete an action
   * @param id Action ID
   * @returns True if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("actions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting action:", error);
      return false;
    }

    return true;
  },

  /**
   * Increment the completed count for an action
   * @param id Action ID
   * @returns Updated action or null if error
   */
  async incrementCompleted(id: string): Promise<Action | null> {
    // First get the current count
    const action = await this.getById(id);
    if (!action) return null;

    const timesCompleted = (action.times_completed || 0) + 1;

    // Then update it
    const { data, error } = await supabase
      .from("actions")
      .update({ times_completed: timesCompleted })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error incrementing completed count:", error);
      return null;
    }

    return data;
  },

  /**
   * Increment the skipped count for an action
   * @param id Action ID
   * @returns Updated action or null if error
   */
  async incrementSkipped(id: string): Promise<Action | null> {
    // First get the current count
    const action = await this.getById(id);
    if (!action) return null;

    const timesSkipped = (action.times_skipped || 0) + 1;

    // Then update it
    const { data, error } = await supabase
      .from("actions")
      .update({ times_skipped: timesSkipped })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error incrementing skipped count:", error);
      return null;
    }

    return data;
  },

  /**
   * Get popular actions based on completion count
   * @param limit Number of actions to return
   * @returns Array of popular actions or empty array if error
   */
  async getPopular(limit: number = 10): Promise<Action[]> {
    const { data, error } = await supabase
      .from("actions")
      .select("*")
      .order("times_completed", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching popular actions:", error);
      return [];
    }

    return data;
  },

  /**
   * Create a custom action for a user
   * @param action Action data to insert
   * @param userId User ID
   * @returns Created action and user_action association or null if error
   */
  async createCustomAction(
    action: Omit<ActionInsert, "is_custom">,
    userId: string
  ): Promise<{ action: Action; userAction: any } | null> {
    // Start a transaction
    const { data: action_data, error: action_error } = await supabase
      .from("actions")
      .insert({
        ...action,
        is_custom: true,
      })
      .select()
      .single();

    if (action_error) {
      console.error("Error creating custom action:", action_error);
      return null;
    }

    // Create the user_action association
    const { data: user_action_data, error: user_action_error } = await supabase
      .from("user_actions")
      .insert({
        user_id: userId,
        action_id: action_data.id,
        assigned_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (user_action_error) {
      console.error(
        "Error associating custom action with user:",
        user_action_error
      );
      // Attempt to clean up the action we just created
      await supabase.from("actions").delete().eq("id", action_data.id);
      return null;
    }

    return {
      action: action_data,
      userAction: user_action_data,
    };
  },
};
