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
      connections: {
        Row: {
          created_at: string | null
          id: string
          receiver_id: string
          requester_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          receiver_id: string
          requester_id: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "connections_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "player_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connections_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "player_details"
            referencedColumns: ["id"]
          },
        ]
      }
      fixtures: {
        Row: {
          created_at: string
          id: string
          match_number: number
          round_number: number
          scheduled_datetime: string | null
          status: string
          team_1_id: string | null
          team_1_score: number | null
          team_2_id: string | null
          team_2_score: number | null
          tournament_id: string
          updated_at: string
          venue: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          match_number: number
          round_number: number
          scheduled_datetime?: string | null
          status?: string
          team_1_id?: string | null
          team_1_score?: number | null
          team_2_id?: string | null
          team_2_score?: number | null
          tournament_id: string
          updated_at?: string
          venue?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          match_number?: number
          round_number?: number
          scheduled_datetime?: string | null
          status?: string
          team_1_id?: string | null
          team_1_score?: number | null
          team_2_id?: string | null
          team_2_score?: number | null
          tournament_id?: string
          updated_at?: string
          venue?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fixtures_team_1_id_fkey"
            columns: ["team_1_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_team_2_id_fkey"
            columns: ["team_2_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fixtures_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "tournament_teams"
            referencedColumns: ["id"]
          },
        ]
      }
      organisers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      organizer_profiles: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string
          contact_person_name: string
          contact_phone: string | null
          country: string | null
          created_at: string
          description: string | null
          established_year: number | null
          facebook_url: string | null
          id: string
          instagram_url: string | null
          linkedin_url: string | null
          logo_url: string | null
          organization_name: string
          sports: string[]
          twitter_url: string | null
          updated_at: string
          user_id: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email: string
          contact_person_name: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          established_year?: number | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          organization_name: string
          sports?: string[]
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string
          contact_person_name?: string
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          established_year?: number | null
          facebook_url?: string | null
          id?: string
          instagram_url?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          organization_name?: string
          sports?: string[]
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      player_details: {
        Row: {
          achievements: string | null
          age: string | null
          background_picture_url: string | null
          bio: string | null
          city: string | null
          clubs: string | null
          created_at: string
          facebook_id: string | null
          full_name: string
          height: string | null
          id: string
          instagram_id: string | null
          position: string
          postcode: string | null
          profile_picture_url: string | null
          sport: string
          updated_at: string
          weight: string | null
          whatsapp_id: string | null
        }
        Insert: {
          achievements?: string | null
          age?: string | null
          background_picture_url?: string | null
          bio?: string | null
          city?: string | null
          clubs?: string | null
          created_at?: string
          facebook_id?: string | null
          full_name: string
          height?: string | null
          id: string
          instagram_id?: string | null
          position: string
          postcode?: string | null
          profile_picture_url?: string | null
          sport: string
          updated_at?: string
          weight?: string | null
          whatsapp_id?: string | null
        }
        Update: {
          achievements?: string | null
          age?: string | null
          background_picture_url?: string | null
          bio?: string | null
          city?: string | null
          clubs?: string | null
          created_at?: string
          facebook_id?: string | null
          full_name?: string
          height?: string | null
          id?: string
          instagram_id?: string | null
          position?: string
          postcode?: string | null
          profile_picture_url?: string | null
          sport?: string
          updated_at?: string
          weight?: string | null
          whatsapp_id?: string | null
        }
        Relationships: []
      }
      tournament_teams: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          status: string
          team_name: string
          tournament_id: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          status?: string
          team_name: string
          tournament_id: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          status?: string
          team_name?: string
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          entry_fee: number | null
          fixture_generation_status: string | null
          format: string
          id: string
          location: string | null
          name: string
          organizer_id: string
          registration_deadline: string | null
          rules: string | null
          sport: string
          start_date: string | null
          team_size: number | null
          teams_allowed: number
          tournament_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          fixture_generation_status?: string | null
          format: string
          id?: string
          location?: string | null
          name: string
          organizer_id: string
          registration_deadline?: string | null
          rules?: string | null
          sport: string
          start_date?: string | null
          team_size?: number | null
          teams_allowed: number
          tournament_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          entry_fee?: number | null
          fixture_generation_status?: string | null
          format?: string
          id?: string
          location?: string | null
          name?: string
          organizer_id?: string
          registration_deadline?: string | null
          rules?: string | null
          sport?: string
          start_date?: string | null
          team_size?: number | null
          teams_allowed?: number
          tournament_status?: string | null
          updated_at?: string
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
