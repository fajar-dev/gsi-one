



DROP POLICY IF EXISTS "notifications_insert_policy" ON public.notifications;

CREATE POLICY "notifications_insert_policy" ON public.notifications
  FOR INSERT TO public
  WITH CHECK (true);


DROP POLICY IF EXISTS "notifications_select_policy" ON public.notifications;

CREATE POLICY "notifications_select_policy" ON public.notifications
  FOR SELECT TO authenticated
  USING (true);


DROP POLICY IF EXISTS "notifications_update_policy" ON public.notifications;

CREATE POLICY "notifications_update_policy" ON public.notifications
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);


DROP POLICY IF EXISTS "notifications_delete_policy" ON public.notifications;

CREATE POLICY "notifications_delete_policy" ON public.notifications
  FOR DELETE TO authenticated
  USING (true);


CREATE OR REPLACE FUNCTION public.handle_new_booking_notification()
RETURNS TRIGGER AS $$
BEGIN
  
  INSERT INTO public.notifications (target_role, title, message, type, reference_id, is_read)
  VALUES (
    'admin',
    'Book Survey Baru',
    'Klien ' || COALESCE(NEW.full_name, 'Tamu') || ' telah mengajukan Book Survey untuk ' || COALESCE(NEW.service_type, 'Survey') || '.',
    'book_survey',
    NEW.id::text,
    false
  );

  
  INSERT INTO public.notifications (target_role, title, message, type, reference_id, is_read)
  VALUES (
    'marketing',
    'Book Survey Baru Masuk',
    'Book Survey baru diterima dari ' || COALESCE(NEW.full_name, 'Tamu') || ' (' || COALESCE(NEW.service_type, 'Survey') || ').',
    'book_survey',
    NEW.id::text,
    false
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_notify_on_new_booking ON public.bookings;
CREATE TRIGGER trg_notify_on_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_booking_notification();


DROP POLICY IF EXISTS "bookings_update_staff" ON public.bookings;
CREATE POLICY "bookings_update_staff" ON public.bookings 
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "bookings_delete_admin" ON public.bookings;
CREATE POLICY "bookings_delete_admin" ON public.bookings 
  FOR DELETE TO authenticated
  USING (true);


ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'claimed', 'approved', 'rejected'));


