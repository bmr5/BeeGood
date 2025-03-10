import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

// Export types for use in components and state management
export type User = Tables<"users">;
export type UserInsert = TablesInsert<"users">;
export type UserUpdate = TablesUpdate<"users">;

/**
 * Service for handling user-related operations with Supabase
 */
export const UserService = {
  /**
   * Get a user by ID
   * @param id User ID
   * @returns User object or null if not found
   */
  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return null;
    }

    return data;
  },

  /**
   * Get a user by email
   * @param email User email
   * @returns User object or null if not found
   */
  async getByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }

    return data;
  },

  /**
   * Get a user by username
   * @param username Username
   * @returns User object or null if not found
   */
  async getByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Error fetching user by username:", error);
      return null;
    }

    return data;
  },

  /**
   * Create a new user
   * @param user User data to insert
   * @returns Created user or null if error
   */
  async create(user: UserInsert): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .insert(user)
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a user
   * @param id User ID
   * @param updates Fields to update
   * @returns Updated user or null if error
   */
  async update(id: string, updates: UserUpdate): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return null;
    }

    return data;
  },

  /**
   * Delete a user
   * @param id User ID
   * @returns True if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user:", error);
      return false;
    }

    return true;
  },

  /**
   * Get all users
   * @returns Array of users or empty array if error
   */
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching all users:", error);
      return [];
    }

    return data;
  },

  /**
   * Update user streak information
   * @param id User ID
   * @param streakCount New streak count
   * @param lastDeedDate Last deed completion date
   * @returns Updated user or null if error
   */
  async updateStreak(
    id: string,
    streakCount: number,
    lastDeedDate: string
  ): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update({
        streak_count: streakCount,
        last_deed_date: lastDeedDate,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user streak:", error);
      return null;
    }

    return data;
  },

  /**
   * Mark user onboarding as completed
   * @param id User ID
   * @returns Updated user or null if error
   */
  async completeOnboarding(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error completing user onboarding:", error);
      return null;
    }

    return data;
  },

  /**
   * Update user preferences
   * @param id User ID
   * @param preferences User preferences object
   * @returns Updated user or null if error
   */
  async updatePreferences(id: string, preferences: any): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .update({ preferences })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user preferences:", error);
      return null;
    }

    return data;
  },
};
