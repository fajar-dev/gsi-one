
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
      projects: {
        Row: {
          id: number;
          project_code: string | null;
          project_name: string;
          client_name: string;
          budget: number | null;
          start_date: string;
          estimated_finish: string;
          status: 'pending' | 'on_progress' | 'done' | 'on_hold';
          created_by: string;
          client_id: string | null;
          marketing_id: string | null;
          engineer_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          project_code?: string | null;
          project_name: string;
          client_name: string;
          budget?: number | null;
          start_date: string;
          estimated_finish: string;
          status?: 'pending' | 'on_progress' | 'done' | 'on_hold';
          created_by: string;
          client_id?: string | null;
          marketing_id?: string | null;
          engineer_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          project_code?: string | null;
          project_name?: string;
          client_name?: string;
          budget?: number | null;
          start_date?: string;
          estimated_finish?: string;
          status?: 'pending' | 'on_progress' | 'done' | 'on_hold';
          created_by?: string;
          client_id?: string | null;
          marketing_id?: string | null;
          engineer_id?: string | null;
          created_at?: string;
        };
      };
      project_stages: {
        Row: {
          id: number;
          project_id: string;
          title: string;
          description: string | null;
          sequence: number;
          status: 'pending' | 'in_progress' | 'done';
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          project_id: string;
          title: string;
          description?: string | null;
          sequence?: number;
          status?: 'pending' | 'in_progress' | 'done';
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          project_id?: string;
          title?: string;
          description?: string | null;
          sequence?: number;
          status?: 'pending' | 'in_progress' | 'done';
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      stage_updates: {
        Row: {
          id: number;
          stage_id: string;
          project_id: string | null;
          description: string;
          progress: number | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          stage_id: string;
          project_id?: string | null;
          description: string;
          progress?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          stage_id?: string;
          project_id?: string | null;
          description?: string;
          progress?: number | null;
          created_by?: string | null;
          created_at?: string;
        };
      };
      project_files: {
        Row: {
          id: number;
          project_id: string;
          stage_id: string | null;
          file_name: string;
          file_url: string | null;
          file_type: 'image' | 'report' | 'invoice' | 'drawing' | 'contract' | 'video' | 'other';
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          project_id: string;
          stage_id?: string | null;
          file_name: string;
          file_url?: string | null;
          file_type?: 'image' | 'report' | 'invoice' | 'drawing' | 'contract' | 'video' | 'other';
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          project_id?: string;
          stage_id?: string | null;
          file_name?: string;
          file_url?: string | null;
          file_type?: 'image' | 'report' | 'invoice' | 'drawing' | 'contract' | 'video' | 'other';
          uploaded_by?: string | null;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: number;
          full_name: string;
          company_name: string | null;
          phone: string;
          email: string;
          service_type: string;
          location: string;
          preferred_date: string | null;
          message: string | null;
          status: string;
          claimed_by: string | null;
          claimed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          full_name: string;
          company_name?: string | null;
          phone: string;
          email: string;
          service_type: string;
          location: string;
          preferred_date?: string | null;
          message?: string | null;
          status?: string;
          claimed_by?: string | null;
          claimed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          full_name?: string;
          company_name?: string | null;
          phone?: string;
          email?: string;
          service_type?: string;
          location?: string;
          preferred_date?: string | null;
          message?: string | null;
          status?: string;
          claimed_by?: string | null;
          claimed_at?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: number;
          user_id: string | null;
          target_role: string | null;
          title: string;
          message: string;
          type: string;
          reference_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id?: string | null;
          target_role?: string | null;
          title: string;
          message: string;
          type: string;
          reference_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string | null;
          target_role?: string | null;
          title?: string;
          message?: string;
          type?: string;
          reference_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

export type ProjectRow = Database['public']['Tables']['projects']['Row'];
export type ProjectStageRow = Database['public']['Tables']['project_stages']['Row'];
export type StageUpdateRow = Database['public']['Tables']['stage_updates']['Row'];
export type ProjectFileRow = Database['public']['Tables']['project_files']['Row'];
export type BookingRow = Database['public']['Tables']['bookings']['Row'];
export type NotificationRow = Database['public']['Tables']['notifications']['Row'];

