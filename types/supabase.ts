export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actions: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          is_custom: boolean | null
          times_completed: number | null
          times_skipped: number | null
          title: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          times_completed?: number | null
          times_skipped?: number | null
          title: string
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          times_completed?: number | null
          times_skipped?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "actions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_actions: {
        Row: {
          action_id: string | null
          assigned_date: string
          completed: boolean | null
          completion_date: string | null
          created_at: string | null
          id: string
          notes: string | null
          skipped: boolean | null
          user_id: string | null
        }
        Insert: {
          action_id?: string | null
          assigned_date: string
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          skipped?: boolean | null
          user_id?: string | null
        }
        Update: {
          action_id?: string | null
          assigned_date?: string
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          skipped?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actions_history: {
        Row: {
          action_id: string | null
          archived_at: string | null
          assigned_date: string
          completed: boolean | null
          completion_date: string | null
          created_at: string | null
          id: string
          notes: string | null
          skipped: boolean | null
          user_id: string | null
        }
        Insert: {
          action_id?: string | null
          archived_at?: string | null
          assigned_date: string
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          skipped?: boolean | null
          user_id?: string | null
        }
        Update: {
          action_id?: string | null
          archived_at?: string | null
          assigned_date?: string
          completed?: boolean | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          skipped?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_history_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_actions_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          age_range: string | null
          available_minutes: number | null
          available_time: string | null
          created_at: string | null
          current_goals: string | null
          daily_schedule: string | null
          id: string
          improvement_areas: string[] | null
          interests: string[] | null
          living_situation: string | null
          spiritual_background: string | null
          updated_at: string | null
          user_id: string | null
          values: string[] | null
          work_schedule: string | null
        }
        Insert: {
          age_range?: string | null
          available_minutes?: number | null
          available_time?: string | null
          created_at?: string | null
          current_goals?: string | null
          daily_schedule?: string | null
          id?: string
          improvement_areas?: string[] | null
          interests?: string[] | null
          living_situation?: string | null
          spiritual_background?: string | null
          updated_at?: string | null
          user_id?: string | null
          values?: string[] | null
          work_schedule?: string | null
        }
        Update: {
          age_range?: string | null
          available_minutes?: number | null
          available_time?: string | null
          created_at?: string | null
          current_goals?: string | null
          daily_schedule?: string | null
          id?: string
          improvement_areas?: string[] | null
          interests?: string[] | null
          living_situation?: string | null
          spiritual_background?: string | null
          updated_at?: string | null
          user_id?: string | null
          values?: string[] | null
          work_schedule?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stats: {
        Row: {
          category_id: string | null
          created_at: string | null
          id: string
          score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          device_id: string | null
          email: string | null
          full_name: string | null
          id: string
          last_action_date: string | null
          onboarding_completed: boolean | null
          preferences: Json | null
          streak_count: number | null
          timezone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          device_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_action_date?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          streak_count?: number | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          device_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_action_date?: string | null
          onboarding_completed?: boolean | null
          preferences?: Json | null
          streak_count?: number | null
          timezone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      user_stats_view: {
        Row: {
          category_color: string | null
          category_name: string | null
          completed_actions_count: number | null
          score: number | null
          user_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      belongs_to_current_device: {
        Args: {
          record_device_id: string
        }
        Returns: boolean
      }
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_user_id_from_device_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      set_user_id_from_device_id: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
