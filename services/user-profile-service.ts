import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

// Export types for use in components and state management
export type UserProfile = Tables<"user_profiles">;
export type UserProfileInsert = TablesInsert<"user_profiles">;
export type UserProfileUpdate = TablesUpdate<"user_profiles">;

/**
 * Service for handling user profile operations with Supabase
 */
export const UserProfileService = {
  /**
   * Get a user profile by ID
   * @param id Profile ID
   * @returns User profile object or null if not found
   */
  async getById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data;
  },

  /**
   * Get a user profile by user ID
   * @param userId User ID
   * @returns User profile object or null if not found
   */
  async getByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }

    // Return null if no profile exists instead of throwing an error
    if (!data || data.length === 0) {
      return null;
    }

    return data[0];
  },

  /**
   * Create a new user profile
   * @param profile User profile data to insert
   * @returns Created user profile or null if error
   */
  async create(profile: UserProfileInsert): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error("Error creating user profile:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a user profile
   * @param id Profile ID
   * @param updates Fields to update
   * @returns Updated user profile or null if error
   */
  async update(
    id: string,
    updates: UserProfileUpdate
  ): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a user profile by user ID
   * @param userId User ID
   * @param updates Fields to update
   * @returns Updated user profile or null if error
   */
  async updateByUserId(
    userId: string,
    updates: UserProfileUpdate
  ): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update(updates)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user profile by user ID:", error);
      return null;
    }

    return data;
  },

  /**
   * Delete a user profile
   * @param id Profile ID
   * @returns True if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting user profile:", error);
      return false;
    }

    return true;
  },

  /**
   * Delete a user profile by user ID
   * @param userId User ID
   * @returns True if successful, false otherwise
   */
  async deleteByUserId(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from("user_profiles")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting user profile by user ID:", error);
      return false;
    }

    return true;
  },

  /**
   * Update user improvement areas
   * @param userId User ID
   * @param improvementAreas Array of improvement areas
   * @returns Updated user profile or null if error
   */
  async updateImprovementAreas(
    userId: string,
    improvementAreas: string[]
  ): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ improvement_areas: improvementAreas })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating improvement areas:", error);
      return null;
    }

    return data;
  },

  /**
   * Update user interests
   * @param userId User ID
   * @param interests Array of interests
   * @returns Updated user profile or null if error
   */
  async updateInterests(
    userId: string,
    interests: string[]
  ): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ interests })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating interests:", error);
      return null;
    }

    return data;
  },

  /**
   * Update user values
   * @param userId User ID
   * @param values Array of values
   * @returns Updated user profile or null if error
   */
  async updateValues(
    userId: string,
    values: string[]
  ): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({ values })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating values:", error);
      return null;
    }

    return data;
  },

  /**
   * Update user availability information
   * @param userId User ID
   * @param availableTime Description of available time
   * @param availableMinutes Number of available minutes
   * @returns Updated user profile or null if error
   */
  async updateAvailability(
    userId: string,
    availableTime: string,
    availableMinutes: number
  ): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        available_time: availableTime,
        available_minutes: availableMinutes,
      })
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating availability:", error);
      return null;
    }

    return data;
  },
};
