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
      citernes: {
        Row: {
          assigned_driver_id: string | null
          capacity_liters: number | null
          created_at: string
          id: string
          registration: string
          status: Database["public"]["Enums"]["statut_citerne"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_driver_id?: string | null
          capacity_liters?: number | null
          created_at?: string
          id?: string
          registration: string
          status?: Database["public"]["Enums"]["statut_citerne"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_driver_id?: string | null
          capacity_liters?: number | null
          created_at?: string
          id?: string
          registration?: string
          status?: Database["public"]["Enums"]["statut_citerne"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "citernes_assigned_driver_id_fkey"
            columns: ["assigned_driver_id"]
            isOneToOne: true
            referencedRelation: "conducteurs"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      commandes: {
        Row: {
          client_id: string
          created_at: string
          estimated_amount: number
          id: number
          order_date: string
          order_number: string
          product: Database["public"]["Enums"]["type_produit"]
          quantity: number
          status: Database["public"]["Enums"]["statut_commun"]
          unit_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          estimated_amount: number
          id?: number
          order_date?: string
          order_number: string
          product: Database["public"]["Enums"]["type_produit"]
          quantity: number
          status?: Database["public"]["Enums"]["statut_commun"]
          unit_price: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          estimated_amount?: number
          id?: number
          order_date?: string
          order_number?: string
          product?: Database["public"]["Enums"]["type_produit"]
          quantity?: number
          status?: Database["public"]["Enums"]["statut_commun"]
          unit_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commandes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      conducteurs: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["statut_conducteur"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["statut_conducteur"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["statut_conducteur"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      livraisons: {
        Row: {
          citerne_id: string
          commande_id: number
          created_at: string
          date_livraison: string
          id: number
          payment_status: Database["public"]["Enums"]["statut_paiement"]
          status: Database["public"]["Enums"]["statut_commun"]
          updated_at: string
          user_id: string | null
          volume_livre: number
          volume_manquant: number
        }
        Insert: {
          citerne_id: string
          commande_id: number
          created_at?: string
          date_livraison: string
          id?: number
          payment_status?: Database["public"]["Enums"]["statut_paiement"]
          status?: Database["public"]["Enums"]["statut_commun"]
          updated_at?: string
          user_id?: string | null
          volume_livre: number
          volume_manquant: number
        }
        Update: {
          citerne_id?: string
          commande_id?: number
          created_at?: string
          date_livraison?: string
          id?: number
          payment_status?: Database["public"]["Enums"]["statut_paiement"]
          status?: Database["public"]["Enums"]["statut_commun"]
          updated_at?: string
          user_id?: string | null
          volume_livre?: number
          volume_manquant?: number
        }
        Relationships: [
          {
            foreignKeyName: "livraisons_citerne_id_fkey"
            columns: ["citerne_id"]
            isOneToOne: false
            referencedRelation: "citernes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "livraisons_commande_id_fkey"
            columns: ["commande_id"]
            isOneToOne: true
            referencedRelation: "commandes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
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
      statut_citerne: "Disponible" | "En livraison" | "En maintenance"
      statut_commun: "Non Livré" | "Livré" | "Annulée"
      statut_conducteur: "available" | "on_delivery" | "maintenance"
      statut_paiement: "PAYÉ" | "NON PAYÉ"
      type_produit: "Essence" | "Gasoil"
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
      statut_citerne: ["Disponible", "En livraison", "En maintenance"],
      statut_commun: ["Non Livré", "Livré", "Annulée"],
      statut_conducteur: ["available", "on_delivery", "maintenance"],
      statut_paiement: ["PAYÉ", "NON PAYÉ"],
      type_produit: ["Essence", "Gasoil"],
    },
  },
} as const
