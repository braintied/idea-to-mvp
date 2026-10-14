// Types for the database, so the editor and Claude know every column.
// After you change a migration, regenerate this file with:
//   pnpm db:types
// (It needs SUPABASE_PROJECT_ID set; see README.)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ContactStage = "lead" | "talking" | "customer" | "partner" | "archived";

export type Database = {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          added_to_crm_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          created_at?: string;
          added_to_crm_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
          added_to_crm_at?: string | null;
        };
        Relationships: [];
      };
      contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string | null;
          company: string | null;
          stage: string;
          last_contacted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          name: string;
          email?: string | null;
          company?: string | null;
          stage?: string;
          last_contacted_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string | null;
          company?: string | null;
          stage?: string;
          last_contacted_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          contact_id: string;
          body: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          contact_id: string;
          body: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_id?: string;
          body?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: false;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Contact = Database["public"]["Tables"]["contacts"]["Row"];
export type Note = Database["public"]["Tables"]["notes"]["Row"];
export type WaitlistEntry = Database["public"]["Tables"]["waitlist"]["Row"];
