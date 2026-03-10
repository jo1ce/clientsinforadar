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
      managers: {
        Row: {
          id: string;
          name: string;
          feishu_user_id: string | null;
          feishu_open_id: string | null;
          role: "admin" | "manager";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          feishu_user_id?: string | null;
          feishu_open_id?: string | null;
          role?: "admin" | "manager";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          feishu_user_id?: string | null;
          feishu_open_id?: string | null;
          role?: "admin" | "manager";
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          name: string;
          credit_code: string | null;
          source_ids: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          credit_code?: string | null;
          source_ids?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          credit_code?: string | null;
          source_ids?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      manager_companies: {
        Row: {
          id: string;
          manager_id: string;
          company_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          manager_id: string;
          company_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          manager_id?: string;
          company_id?: string;
          created_at?: string;
        };
      };
      info_items: {
        Row: {
          id: string;
          company_id: string;
          type: string;
          title: string;
          summary: string | null;
          url: string | null;
          source: string;
          raw: Json | null;
          fetched_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          type: string;
          title: string;
          summary?: string | null;
          url?: string | null;
          source: string;
          raw?: Json | null;
          fetched_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          type?: string;
          title?: string;
          summary?: string | null;
          url?: string | null;
          source?: string;
          raw?: Json | null;
          fetched_at?: string;
          created_at?: string;
        };
      };
      push_config: {
        Row: {
          id: string;
          info_type: string;
          target_type: "manager" | "feishu_group";
          target_id: string;
          enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          info_type: string;
          target_type: "manager" | "feishu_group";
          target_id: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          info_type?: string;
          target_type?: "manager" | "feishu_group";
          target_id?: string;
          enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Manager = Database["public"]["Tables"]["managers"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type ManagerCompany = Database["public"]["Tables"]["manager_companies"]["Row"];
export type InfoItem = Database["public"]["Tables"]["info_items"]["Row"];
export type PushConfig = Database["public"]["Tables"]["push_config"]["Row"];
