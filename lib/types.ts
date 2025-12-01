export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          first_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          first_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          first_name?: string | null;
          created_at?: string;
        };
      };
      subscribers: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          status: string;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          email: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          email?: string;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          status?: string;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lookups: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          email: string;
          input_value: string;
          normalized_value: string | null;
          carrier_name: string | null;
          dot_number: string | null;
          mc_number: string | null;
          authority_status: string | null;
          insurance_status: string | null;
          risk_score: number | null;
          risk_level: string | null;
          notes: string | null;
          raw: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          email: string;
          input_value: string;
          normalized_value?: string | null;
          carrier_name?: string | null;
          dot_number?: string | null;
          mc_number?: string | null;
          authority_status?: string | null;
          insurance_status?: string | null;
          risk_score?: number | null;
          risk_level?: string | null;
          notes?: string | null;
          raw?: Json | null;
        };
        Update: Partial<Database["public"]["Tables"]["lookups"]["Row"]>;
      };
      alerts: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          email: string;
          dot_number: string | null;
          mc_number: string | null;
          carrier_name: string | null;
          alert_type: string;
          alert_message: string;
          resolved: boolean;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          email: string;
          dot_number?: string | null;
          mc_number?: string | null;
          carrier_name?: string | null;
          alert_type: string;
          alert_message: string;
          resolved?: boolean;
          resolved_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["alerts"]["Row"]>;
      };
    };
  };
}
