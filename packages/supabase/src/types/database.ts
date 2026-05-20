/**
 * Tipos de la base de datos RENACE.
 *
 * Estos tipos están escritos a mano para no depender de un Supabase corriendo.
 * En cuanto el proyecto esté linkeado, se pueden regenerar con:
 *   `supabase gen types typescript --linked > packages/supabase/src/types/database.ts`
 */
import type { SupabaseClient } from "@supabase/supabase-js";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          alias: string;
          area_focus: AreaId[];
          aria_name: string;
          aria_persist: boolean;
          day_in_program: number;
          city: string | null;
          age: number | null;
          is_mentor: boolean;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          alias: string;
          area_focus?: AreaId[];
          aria_name?: string;
          aria_persist?: boolean;
          day_in_program?: number;
          city?: string | null;
          age?: number | null;
          is_mentor?: boolean;
          onboarding_completed?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      mood_logs: {
        Row: { id: string; user_id: string; score: number; note: string | null; created_at: string };
        Insert: { user_id: string; score: number; note?: string | null };
        Update: Partial<Database["public"]["Tables"]["mood_logs"]["Insert"]>;
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          sentiment: "positive" | "neutral" | "negative" | "mixed" | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          content: string;
          sentiment?: "positive" | "neutral" | "negative" | "mixed" | null;
        };
        Update: Partial<Database["public"]["Tables"]["journal_entries"]["Insert"]>;
        Relationships: [];
      };
      triggers: {
        Row: {
          id: string;
          user_id: string;
          label: string;
          severity: 1 | 2 | 3;
          last_seen_at: string;
          created_at: string;
        };
        Insert: { user_id: string; label: string; severity?: 1 | 2 | 3 };
        Update: Partial<Database["public"]["Tables"]["triggers"]["Insert"]>;
        Relationships: [];
      };
      area_progress: {
        Row: {
          user_id: string;
          area: AreaId;
          percent: number;
          status: "on_track" | "attention" | "blocked" | "done";
          updated_at: string;
        };
        Insert: {
          user_id: string;
          area: AreaId;
          percent?: number;
          status?: "on_track" | "attention" | "blocked" | "done";
        };
        Update: Partial<Database["public"]["Tables"]["area_progress"]["Insert"]>;
        Relationships: [];
      };
      legal_cases: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          status: "open" | "in_progress" | "closed";
          lawyer_name: string | null;
          next_meeting_at: string | null;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          status?: "open" | "in_progress" | "closed";
          lawyer_name?: string | null;
          next_meeting_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["legal_cases"]["Insert"]>;
        Relationships: [];
      };
      consult_requests: {
        Row: {
          id: string;
          user_id: string;
          category: ConsultCategory;
          body: string;
          status: "submitted" | "reviewing" | "scheduled" | "closed";
          created_at: string;
        };
        Insert: {
          user_id: string;
          category: ConsultCategory;
          body: string;
          status?: "submitted" | "reviewing" | "scheduled" | "closed";
        };
        Update: Partial<Database["public"]["Tables"]["consult_requests"]["Insert"]>;
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          slug: string;
          title: string;
          hours_min: number;
          hours_max: number;
          exit_market: string;
          demand: "alta" | "muy_alta" | "transversal";
          format: string;
          emoji: string | null;
          description: string | null;
        };
        Insert: {
          slug: string;
          title: string;
          hours_min: number;
          hours_max: number;
          exit_market: string;
          demand: "alta" | "muy_alta" | "transversal";
          format?: string;
          emoji?: string | null;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["courses"]["Insert"]>;
        Relationships: [];
      };
      job_offers: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          match_score: number;
          partner_company: boolean;
          schedule: string | null;
          created_at: string;
        };
        Insert: {
          title: string;
          company: string;
          location: string;
          match_score?: number;
          partner_company?: boolean;
          schedule?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["job_offers"]["Insert"]>;
        Relationships: [];
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          offer_id: string;
          status: "interested" | "applied" | "interview" | "rejected" | "hired";
          created_at: string;
        };
        Insert: {
          user_id: string;
          offer_id: string;
          status?: "interested" | "applied" | "interview" | "rejected" | "hired";
        };
        Update: Partial<Database["public"]["Tables"]["job_applications"]["Insert"]>;
        Relationships: [];
      };
      community_posts: {
        Row: { id: string; user_id: string; body: string; created_at: string };
        Insert: { user_id: string; body: string };
        Update: Partial<Database["public"]["Tables"]["community_posts"]["Insert"]>;
        Relationships: [];
      };
      community_reactions: {
        Row: {
          post_id: string;
          user_id: string;
          kind: "like" | "comment_count";
          created_at: string;
        };
        Insert: { post_id: string; user_id: string; kind: "like" | "comment_count" };
        Update: Partial<Database["public"]["Tables"]["community_reactions"]["Insert"]>;
        Relationships: [];
      };
      live_events: {
        Row: {
          id: string;
          title: string;
          kind: "support_group" | "class" | "workshop" | "sport";
          starts_at: string;
          capacity: number;
          description: string | null;
        };
        Insert: {
          title: string;
          kind?: "support_group" | "class" | "workshop" | "sport";
          starts_at: string;
          capacity?: number;
          description?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["live_events"]["Insert"]>;
        Relationships: [];
      };
      event_attendees: {
        Row: { event_id: string; user_id: string; created_at: string };
        Insert: { event_id: string; user_id: string };
        Update: Partial<Database["public"]["Tables"]["event_attendees"]["Insert"]>;
        Relationships: [];
      };
      timeline_milestones: {
        Row: {
          id: string;
          user_id: string;
          week: number;
          title: string;
          body: string;
          status: "pending" | "in_progress" | "done";
          order_index: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          week: number;
          title: string;
          body: string;
          status?: "pending" | "in_progress" | "done";
          order_index?: number;
        };
        Update: Partial<Database["public"]["Tables"]["timeline_milestones"]["Insert"]>;
        Relationships: [];
      };
      aria_messages: {
        Row: {
          id: string;
          user_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          role: "user" | "assistant" | "system";
          content: string;
        };
        Update: Partial<Database["public"]["Tables"]["aria_messages"]["Insert"]>;
        Relationships: [];
      };
      trusted_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          relation: string | null;
          created_at: string;
        };
        Insert: { user_id: string; name: string; phone: string; relation?: string | null };
        Update: Partial<Database["public"]["Tables"]["trusted_contacts"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      area_id: AreaId;
      consult_category: ConsultCategory;
      reaction_kind: "like" | "comment_count";
    };
  };
};

export type AreaId = "emocional" | "fisica" | "juridica" | "laboral" | "comunidad";
export type ConsultCategory = "debt" | "custody" | "complaint" | "aid" | "docs" | "other";

export type RenaceClient = SupabaseClient<
  Database,
  "public",
  "public",
  Database["public"]
>;

export type Tables = Database["public"]["Tables"];
export type Profile = Tables["profiles"]["Row"];
export type MoodLog = Tables["mood_logs"]["Row"];
export type JournalEntry = Tables["journal_entries"]["Row"];
export type Trigger = Tables["triggers"]["Row"];
export type AreaProgress = Tables["area_progress"]["Row"];
export type LegalCase = Tables["legal_cases"]["Row"];
export type ConsultRequest = Tables["consult_requests"]["Row"];
export type Course = Tables["courses"]["Row"];
export type JobOffer = Tables["job_offers"]["Row"];
export type JobApplication = Tables["job_applications"]["Row"];
export type CommunityPost = Tables["community_posts"]["Row"];
export type LiveEvent = Tables["live_events"]["Row"];
export type EventAttendee = Tables["event_attendees"]["Row"];
export type TimelineMilestone = Tables["timeline_milestones"]["Row"];
export type AriaMessage = Tables["aria_messages"]["Row"];
export type TrustedContact = Tables["trusted_contacts"]["Row"];
