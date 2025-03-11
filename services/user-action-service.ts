import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";
import { ActionService } from "@/services/action-service";

// Export types for use in components and state management
export type UserAction = Tables<"user_actions">;
export type UserActionInsert = TablesInsert<"user_actions">;
export type UserActionUpdate = TablesUpdate<"user_actions">;

/**
 * Service for handling user action operations with Supabase
 */
export const UserActionService = {
  /**
   * Get a user action by ID
   * @param id User action ID
   * @returns User action object or null if not found
   */
  async getById(id: string): Promise<UserAction | null> {
    const { data, error } = await supabase
      .from("user_actions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user action:", error);
      return null;
    }

    return data;
  },

  /**
   * Get user actions by user ID
   * @param userId User ID
   * @returns Array of user actions or empty array if error
   */
  async getByUserId(userId: string): Promise<UserAction[]> {
    const { data, error } = await supabase
      .from("user_actions")
      .select("*")
      .eq("user_id", userId)
      .order("assigned_date", { ascending: false });

    if (error) {
      console.error("Error fetching user actions by user ID:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user actions by action ID
   * @param actionId Action ID
   * @returns Array of user actions or empty array if error
   */
  async getByActionId(actionId: string): Promise<UserAction[]> {
    const { data, error } = await supabase
      .from("user_actions")
      .select("*")
      .eq("action_id", actionId)
      .order("assigned_date", { ascending: false });

    if (error) {
      console.error("Error fetching user actions by action ID:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user actions with action details
   * @param userId User ID
   * @returns Array of user actions with action details or empty array if error
   */
  async getWithActionDetails(
    userId: string
  ): Promise<(UserAction & { action: any })[]> {
    const { data, error } = await supabase
      .from("user_actions")
      .select(
        `
        *,
        action:actions(*)
      `
      )
      .eq("user_id", userId)
      .order("assigned_date", { ascending: false });

    if (error) {
      console.error("Error fetching user actions with details:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user actions for today
   * @param userId User ID
   * @returns Array of today's user actions or empty array if error
   */
  async getTodaysActions(userId: string): Promise<UserAction[]> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("user_actions")
      .select("*")
      .eq("user_id", userId)
      .eq("assigned_date", today);

    if (error) {
      console.error("Error fetching today's actions:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user action for today with action details
   * @param userId User ID
   * @returns Today's user action with details or null if not found or error
   */
  async getTodaysActionWithDetails(
    userId: string
  ): Promise<(UserAction & { action: any }) | null> {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("user_actions")
      .select(
        `
        *,
        action:actions(*, category:categories(*))
      `
      )
      .eq("user_id", userId)
      .eq("assigned_date", today)
      .limit(1)
      .single();

    if (error) {
      // If no rows match, return null instead of treating it as an error
      if (error.code === "PGRST116") {
        console.log("No action found for today");
        return null;
      }

      console.error("Error fetching today's action with details:", error);
      return null;
    }

    return data;
  },

  /**
   * Create a new user action
   * @param userAction User action data to insert
   * @returns Created user action or null if error
   */
  async create(userAction: UserActionInsert): Promise<UserAction | null> {
    const { data, error } = await supabase
      .from("user_actions")
      .insert(userAction)
      .select()
      .single();

    if (error) {
      console.error("Error creating user action:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a user action
   * @param id User action ID
   * @param updates Fields to update
   * @returns Updated user action or null if error
   */
  async update(
    id: string,
    updates: UserActionUpdate
  ): Promise<UserAction | null> {
    const { data, error } = await supabase
      .from("user_actions")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating user action:", error);
      return null;
    }

    return data && data.length > 0 ? data[0] : null;
  },

  /**
   * Delete a user action
   * @param id User action ID
   * @returns True if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("user_actions").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user action:", error);
      return false;
    }

    return true;
  },

  /**
   * Mark a user action as completed
   * @param id User action ID
   * @returns Updated user action or null if error
   */
  async markAsCompleted(id: string): Promise<UserAction | null> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("user_actions")
      .update({
        completed: true,
        skipped: false,
        completion_date: now,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error marking action as completed:", error);
      return null;
    }

    // Use ActionService with null check
    const actionId = data.action_id;
    if (actionId) {
      await ActionService.incrementCompleted(actionId);
    }

    return data;
  },

  /**
   * Mark a user action as uncompleted
   * @param id User action ID
   * @returns Updated user action or null if error
   */
  async markAsUncompleted(id: string): Promise<UserAction | null> {
    const { data, error } = await supabase
      .from("user_actions")
      .update({
        completed: false,
        skipped: false,
        completion_date: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error marking action as uncompleted:", error);
      return null;
    }

    // Use ActionService with null check
    const actionId = data.action_id;
    if (actionId) {
      await ActionService.decrementCompleted(actionId);
    }

    return data;
  },

  /**
   * Mark a user action as skipped
   * @param id User action ID
   * @returns Updated user action or null if error
   */
  async markAsSkipped(id: string): Promise<UserAction | null> {
    const { data, error } = await supabase
      .from("user_actions")
      .update({
        completed: false,
        skipped: true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error marking action as skipped:", error);
      return null;
    }

    // Use ActionService with null check
    const actionId = data.action_id;
    if (actionId) {
      await ActionService.incrementSkipped(actionId);
    }

    return data;
  },

  /**
   * Add notes to a user action
   * @param id User action ID
   * @param notes Notes text
   * @returns Updated user action or null if error
   */
  async addNotes(id: string, notes: string): Promise<UserAction | null> {
    const { data, error } = await supabase
      .from("user_actions")
      .update({ notes })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error adding notes to action:", error);
      return null;
    }

    return data;
  },

  /**
   * Assign new actions to a user
   * @param userId User ID
   * @param actionIds Array of action IDs to assign
   * @param assignedDate Date to assign actions for (defaults to today)
   * @returns Array of created user actions or empty array if error
   */
  async assignActionsToUser(
    userId: string,
    actionIds: string[],
    assignedDate: string = new Date().toISOString().split("T")[0]
  ): Promise<UserAction[]> {
    const userActions = actionIds.map((actionId) => ({
      user_id: userId,
      action_id: actionId,
      assigned_date: assignedDate,
    }));

    const { data, error } = await supabase
      .from("user_actions")
      .insert(userActions)
      .select();

    if (error) {
      console.error("Error assigning actions to user:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user's completed actions count by category
   * @param userId User ID
   * @returns Object with category IDs as keys and counts as values, or empty object if error
   */
  async getCompletedActionsByCategory(
    userId: string
  ): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from("user_actions")
      .select(
        `
        action:actions(category_id)
      `
      )
      .eq("user_id", userId)
      .eq("completed", true);

    if (error) {
      console.error("Error fetching completed actions by category:", error);
      return {};
    }

    // Count actions by category
    const categoryCounts: Record<string, number> = {};
    data.forEach((item) => {
      const categoryId =
        Array.isArray(item.action) && item.action[0]?.category_id;
      if (categoryId) {
        categoryCounts[categoryId] = (categoryCounts[categoryId] || 0) + 1;
      }
    });

    return categoryCounts;
  },

  /**
   * Get user's action history (completed and skipped actions)
   * @param userId User ID
   * @param limit Number of records to return
   * @returns Array of user actions with action details or empty array if error
   */
  async getUserActionHistory(
    userId: string,
    limit: number = 50
  ): Promise<(UserAction & { action: any })[]> {
    const { data, error } = await supabase
      .from("user_actions")
      .select(
        `
        *,
        action:actions(*, category:categories(*))
      `
      )
      .eq("user_id", userId)
      .or("completed.eq.true,skipped.eq.true")
      .order("completion_date", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching user action history:", error);
      return [];
    }

    return data;
  },
};
