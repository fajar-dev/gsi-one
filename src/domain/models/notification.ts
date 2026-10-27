export interface AppNotification {
  id: string;
  user_id: string | null;
  target_role: string | null;
  title: string;
  message: string;
  type: string;
  reference_id: string | null;
  is_read: boolean;
  created_at: string;
}
