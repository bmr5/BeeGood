import { supabase } from "@/lib/supabase";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase";

// Export types for use in components and state management
export type UserStat = Tables<"user_stats">;
export type UserStatInsert = TablesInsert<"user_stats">;
export type UserStatUpdate = TablesUpdate<"user_stats">;

// Define a type for the user_stats_view
export type UserStatView = {
  user_id: string | null;
  username: string | null;
  category_name: string | null;
  category_color: string | null;
  score: number | null;
  completed_actions_count: number | null;
};

/**
 * Service for handling user stats operations with Supabase
 */
export const UserStatsService = {
  /**
   * Get a user stat by ID
   * @param id User stat ID
   * @returns User stat object or null if not found
   */
  async getById(id: string): Promise<UserStat | null> {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching user stat:", error);
      return null;
    }

    return data;
  },

  /**
   * Get user stats by user ID
   * @param userId User ID
   * @returns Array of user stats or empty array if error
   */
  async getByUserId(userId: string): Promise<UserStat[]> {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user stats by user ID:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user stats by user ID and category ID
   * @param userId User ID
   * @param categoryId Category ID
   * @returns User stat object or null if not found
   */
  async getByUserAndCategory(
    userId: string,
    categoryId: string
  ): Promise<UserStat | null> {
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .single();

    if (error) {
      console.error("Error fetching user stat by user and category:", error);
      return null;
    }

    return data;
  },

  /**
   * Get user stats with category information
   * @param userId User ID
   * @returns Array of user stats with category info or empty array if error
   */
  async getWithCategoryInfo(
    userId: string
  ): Promise<(UserStat & { category: any })[]> {
    const { data, error } = await supabase
      .from("user_stats")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user stats with category info:", error);
      return [];
    }

    return data;
  },

  /**
   * Get user stats from the view
   * @param userId User ID
   * @returns Array of user stat views or empty array if error
   */
  async getStatsFromView(userId: string): Promise<UserStatView[]> {
    const { data, error } = await supabase
      .from("user_stats_view")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user stats from view:", error);
      return [];
    }

    return data;
  },

  /**
   * Create a new user stat
   * @param userStat User stat data to insert
   * @returns Created user stat or null if error
   */
  async create(userStat: UserStatInsert): Promise<UserStat | null> {
    const { data, error } = await supabase
      .from("user_stats")
      .insert(userStat)
      .select()
      .single();

    if (error) {
      console.error("Error creating user stat:", error);
      return null;
    }

    return data;
  },

  /**
   * Update a user stat
   * @param id User stat ID
   * @param updates Fields to update
   * @returns Updated user stat or null if error
   */
  async update(id: string, updates: UserStatUpdate): Promise<UserStat | null> {
    const { data, error } = await supabase
      .from("user_stats")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user stat:", error);
      return null;
    }

    return data;
  },

  /**
   * Delete a user stat
   * @param id User stat ID
   * @returns True if successful, false otherwise
   */
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("user_stats").delete().eq("id", id);

    if (error) {
      console.error("Error deleting user stat:", error);
      return false;
    }

    return true;
  },

  /**
   * Initialize stats for a new user
   * @param userId User ID
   * @returns Array of created user stats or empty array if error
   */
  async initializeForNewUser(userId: string): Promise<UserStat[]> {
    // First get all categories
    const { data: categories, error: categoryError } = await supabase
      .from("categories")
      .select("id");

    if (categoryError) {
      console.error(
        "Error fetching categories for stat initialization:",
        categoryError
      );
      return [];
    }

    // Create a stat entry for each category
    const userStats = categories.map((category) => ({
      user_id: userId,
      category_id: category.id,
      score: 0,
    }));

    const { data, error } = await supabase
      .from("user_stats")
      .insert(userStats)
      .select();

    if (error) {
      console.error("Error initializing user stats:", error);
      return [];
    }

    return data;
  },

  /**
   * Update a user's score for a specific category
   * @param userId User ID
   * @param categoryId Category ID
   * @param score New score value
   * @returns Updated user stat or null if error
   */
  async updateScore(
    userId: string,
    categoryId: string,
    score: number
  ): Promise<UserStat | null> {
    // Ensure score is within valid range
    const validScore = Math.max(0, Math.min(100, score));

    const { data, error } = await supabase
      .from("user_stats")
      .update({ score: validScore })
      .eq("user_id", userId)
      .eq("category_id", categoryId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user score:", error);
      return null;
    }

    return data;
  },

  /**
   * Increment a user's score for a specific category
   * @param userId User ID
   * @param categoryId Category ID
   * @param increment Amount to increment (defaults to 1)
   * @returns Updated user stat or null if error
   */
  async incrementScore(
    userId: string,
    categoryId: string,
    increment: number = 1
  ): Promise<UserStat | null> {
    // First get the current score
    const currentStat = await this.getByUserAndCategory(userId, categoryId);

    if (!currentStat) {
      // If no stat exists, create one with the increment as the score
      return this.create({
        user_id: userId,
        category_id: categoryId,
        score: Math.min(increment, 100),
      });
    }

    // Calculate new score, ensuring it doesn't exceed 100
    const currentScore = currentStat.score ?? 0;
    const newScore = Math.min(currentScore + increment, 100);

    return this.updateScore(userId, categoryId, newScore);
  },

  /**
   * Get the user's highest scoring category
   * @param userId User ID
   * @returns Category with highest score or null if error/no stats
   */
  async getHighestScoringCategory(
    userId: string
  ): Promise<{ category: any; score: number } | null> {
    const stats = await this.getWithCategoryInfo(userId);

    if (stats.length === 0) {
      return null;
    }

    // Find the stat with the highest score
    const highestStat = stats.reduce(
      (highest, current) =>
        (current.score ?? 0) > (highest.score ?? 0) ? current : highest,
      stats[0]
    );

    return {
      category: highestStat.category,
      score: highestStat.score ?? 0,
    };
  },

  /**
   * Get the user's lowest scoring category
   * @param userId User ID
   * @returns Category with lowest score or null if error/no stats
   */
  async getLowestScoringCategory(
    userId: string
  ): Promise<{ category: any; score: number } | null> {
    const stats = await this.getWithCategoryInfo(userId);

    if (stats.length === 0) {
      return null;
    }

    // Find the stat with the lowest score
    const lowestStat = stats.reduce(
      (lowest, current) =>
        (current.score ?? 0) < (lowest.score ?? 0) ? current : lowest,
      stats[0]
    );

    return {
      category: lowestStat.category,
      score: lowestStat.score ?? 0,
    };
  },

  /**
   * Get all user stats sorted by score
   * @param userId User ID
   * @param ascending Whether to sort in ascending order (default: false)
   * @returns Array of user stats with category info, sorted by score
   */
  async getStatsSortedByScore(
    userId: string,
    ascending: boolean = false
  ): Promise<(UserStat & { category: any })[]> {
    const stats = await this.getWithCategoryInfo(userId);

    return stats.sort((a, b) =>
      ascending
        ? (a.score ?? 0) - (b.score ?? 0)
        : (b.score ?? 0) - (a.score ?? 0)
    );
  },

  /**
   * Calculate the user's overall goodness score (average of all categories)
   * @param userId User ID
   * @returns Overall score (0-100) or null if error/no stats
   */
  async calculateOverallScore(userId: string): Promise<number | null> {
    const stats = await this.getByUserId(userId);

    if (stats.length === 0) {
      return null;
    }

    const totalScore = stats.reduce((sum, stat) => sum + (stat.score ?? 0), 0);
    return Math.round(totalScore / stats.length);
  },
};
