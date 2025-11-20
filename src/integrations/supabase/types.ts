export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      cultivars: {
        Row: {
          characteristics: string | null
          created_at: string | null
          description: string
          growing_conditions: string | null
          id: string
          image_url: string | null
          name: string
          slug: string
          thai_name: string
          updated_at: string | null
          uses: string | null
        }
        Insert: {
          characteristics?: string | null
          created_at?: string | null
          description: string
          growing_conditions?: string | null
          id?: string
          image_url?: string | null
          name: string
          slug: string
          thai_name: string
          updated_at?: string | null
          uses?: string | null
        }
        Update: {
          characteristics?: string | null
          created_at?: string | null
          description?: string
          growing_conditions?: string | null
          id?: string
          image_url?: string | null
          name?: string
          slug?: string
          thai_name?: string
          updated_at?: string | null
          uses?: string | null
        }
        Relationships: []
      }
      farm_profiles: {
        Row: {
          created_at: string | null
          farm_description: string | null
          farm_image_url: string | null
          farm_location: string
          farm_name: string
          id: string
          rating: number | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          farm_description?: string | null
          farm_image_url?: string | null
          farm_location: string
          farm_name: string
          id?: string
          rating?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          farm_description?: string | null
          farm_image_url?: string | null
          farm_location?: string
          farm_name?: string
          id?: string
          rating?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      farm_upgrade_requests: {
        Row: {
          created_at: string | null
          description: string | null
          farm_location: string
          farm_name: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          farm_location: string
          farm_name: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          farm_location?: string
          farm_name?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_order_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_order_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_order_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          cancellation_reason: string | null
          cancelled_at: string | null
          confirmed_at: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_address: string
          delivery_notes: string | null
          farm_id: string
          id: string
          product_id: string
          quantity: number
          shipped_at: string | null
          status: Database["public"]["Enums"]["order_status"]
          total_price: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address: string
          delivery_notes?: string | null
          farm_id: string
          id?: string
          product_id: string
          quantity: number
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancellation_reason?: string | null
          cancelled_at?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: string
          delivery_notes?: string | null
          farm_id?: string
          id?: string
          product_id?: string
          quantity?: number
          shipped_at?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total_price?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          available_quantity: number
          created_at: string | null
          cultivar_id: string | null
          description: string | null
          expiry_date: string | null
          farm_id: string
          harvest_date: string
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price_per_unit: number
          product_type: Database["public"]["Enums"]["product_type"]
          unit: string
          updated_at: string | null
        }
        Insert: {
          available_quantity?: number
          created_at?: string | null
          cultivar_id?: string | null
          description?: string | null
          expiry_date?: string | null
          farm_id: string
          harvest_date: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price_per_unit: number
          product_type: Database["public"]["Enums"]["product_type"]
          unit?: string
          updated_at?: string | null
        }
        Update: {
          available_quantity?: number
          created_at?: string | null
          cultivar_id?: string | null
          description?: string | null
          expiry_date?: string | null
          farm_id?: string
          harvest_date?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price_per_unit?: number
          product_type?: Database["public"]["Enums"]["product_type"]
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_cultivar_id_fkey"
            columns: ["cultivar_id"]
            isOneToOne: false
            referencedRelation: "cultivars"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          farm_id: string
          id: string
          order_id: string
          rating: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          farm_id: string
          id?: string
          order_id: string
          rating: number
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          farm_id?: string
          id?: string
          order_id?: string
          rating?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "reviewed"
      product_type: "shoot" | "fruit"
      user_role: "user" | "farm" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "reviewed",
      ],
      product_type: ["shoot", "fruit"],
      user_role: ["user", "farm", "admin"],
    },
  },
} as const
