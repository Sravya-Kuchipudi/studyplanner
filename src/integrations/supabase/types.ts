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
      daily_stats: {
        Row: {
          average_productivity: number | null
          created_at: string | null
          goals_completed: number | null
          id: string
          stat_date: string
          total_break_time: unknown | null
          total_distractions: number | null
          total_study_time: unknown | null
          user_id: string | null
        }
        Insert: {
          average_productivity?: number | null
          created_at?: string | null
          goals_completed?: number | null
          id?: string
          stat_date: string
          total_break_time?: unknown | null
          total_distractions?: number | null
          total_study_time?: unknown | null
          user_id?: string | null
        }
        Update: {
          average_productivity?: number | null
          created_at?: string | null
          goals_completed?: number | null
          id?: string
          stat_date?: string
          total_break_time?: unknown | null
          total_distractions?: number | null
          total_study_time?: unknown | null
          user_id?: string | null
        }
        Relationships: []
      }
      study_goals: {
        Row: {
          created_at: string | null
          description: string | null
          goal_title: string
          id: string
          is_completed: boolean | null
          target_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          goal_title: string
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          goal_title?: string
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          break_duration: unknown | null
          created_at: string | null
          distractions: number | null
          duration: unknown | null
          end_time: string
          goal_completed: boolean | null
          goal_set: string | null
          id: string
          notes: string | null
          productivity_score: number | null
          start_time: string
          study_date: string
          subject: string
          topic: string | null
          user_id: string | null
        }
        Insert: {
          break_duration?: unknown | null
          created_at?: string | null
          distractions?: number | null
          duration?: unknown | null
          end_time: string
          goal_completed?: boolean | null
          goal_set?: string | null
          id?: string
          notes?: string | null
          productivity_score?: number | null
          start_time: string
          study_date: string
          subject: string
          topic?: string | null
          user_id?: string | null
        }
        Update: {
          break_duration?: unknown | null
          created_at?: string | null
          distractions?: number | null
          duration?: unknown | null
          end_time?: string
          goal_completed?: boolean | null
          goal_set?: string | null
          id?: string
          notes?: string | null
          productivity_score?: number | null
          start_time?: string
          study_date?: string
          subject?: string
          topic?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
