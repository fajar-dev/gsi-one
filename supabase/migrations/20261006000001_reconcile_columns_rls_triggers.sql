






-- Menambahkan kolom bisnis, policy tulis, helper, dan trigger yang tidak pernah
-- ikut migrasi kerangka 20260730000001.
--
-- JEBAKAN: ADD COLUMN IF NOT EXISTS diam-diam membuang default/NOT NULL/CHECK bila
-- kolomnya sudah ada, jadi kolom yang sudah ada diubah lewat ALTER COLUMN terpisah.
-- JEBAKAN: policy pada public.users tidak boleh memakai subquery inline ke
-- public.users sendiri -- akan rekursi 42P17. Karena itu ada helper SECURITY DEFINER.

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_code     VARCHAR(50);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_name     VARCHAR(255);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client_name      VARCHAR(255);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget           NUMERIC(18,2);
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS start_date       DATE;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS estimated_finish DATE;


ALTER TABLE public.projects ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE public.projects ALTER COLUMN status SET NOT NULL;
ALTER TABLE public.projects ALTER COLUMN project_name SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'projects_status_check' AND conrelid = 'public.projects'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE public.projects ADD CONSTRAINT projects_status_check '
         || 'CHECK (status IN (''pending'',''on_progress'',''done'',''on_hold''))';
  END IF;
END $$;


ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS title       VARCHAR(255);
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS status      VARCHAR(50);
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS updated_by  UUID REFERENCES public.users(id) ON DELETE SET NULL;
ALTER TABLE public.project_stages ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ;

ALTER TABLE public.project_stages ALTER COLUMN status     SET DEFAULT 'pending';
ALTER TABLE public.project_stages ALTER COLUMN status     SET NOT NULL;
ALTER TABLE public.project_stages ALTER COLUMN title      SET NOT NULL;
ALTER TABLE public.project_stages ALTER COLUMN updated_at SET DEFAULT now();
ALTER TABLE public.project_stages ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE public.project_stages ALTER COLUMN project_id SET NOT NULL;
ALTER TABLE public.project_stages ALTER COLUMN sequence   SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'project_stages_status_check' AND conrelid = 'public.project_stages'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE public.project_stages ADD CONSTRAINT project_stages_status_check '
         || 'CHECK (status IN (''pending'',''in_progress'',''done''))';
  END IF;
END $$;


ALTER TABLE public.stage_updates ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.stage_updates ADD COLUMN IF NOT EXISTS progress    INTEGER;
ALTER TABLE public.stage_updates ADD COLUMN IF NOT EXISTS created_by  UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.stage_updates ALTER COLUMN description SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'stage_updates_progress_check' AND conrelid = 'public.stage_updates'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE public.stage_updates ADD CONSTRAINT stage_updates_progress_check '
         || 'CHECK (progress IS NULL OR (progress BETWEEN 0 AND 100))';
  END IF;
END $$;


ALTER TABLE public.project_files ADD COLUMN IF NOT EXISTS file_name   VARCHAR(255);
ALTER TABLE public.project_files ADD COLUMN IF NOT EXISTS file_url    TEXT;
ALTER TABLE public.project_files ADD COLUMN IF NOT EXISTS file_type   VARCHAR(50);
ALTER TABLE public.project_files ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

ALTER TABLE public.project_files ALTER COLUMN file_name SET NOT NULL;
ALTER TABLE public.project_files ALTER COLUMN file_url  SET NOT NULL;
ALTER TABLE public.project_files ALTER COLUMN file_type SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'project_files_file_type_check' AND conrelid = 'public.project_files'::regclass
  ) THEN
    EXECUTE 'ALTER TABLE public.project_files ADD CONSTRAINT project_files_file_type_check '
         || 'CHECK (file_type IN (''image'',''report'',''invoice'',''drawing'',''contract'',''video'',''other''))';
  END IF;
END $$;


ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS type         VARCHAR(50);
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS reference_id TEXT;

ALTER TABLE public.notifications ALTER COLUMN title   SET NOT NULL;
ALTER TABLE public.notifications ALTER COLUMN message SET NOT NULL;
ALTER TABLE public.notifications ALTER COLUMN type    SET NOT NULL;
ALTER TABLE public.notifications ALTER COLUMN is_read SET DEFAULT false;
ALTER TABLE public.notifications ALTER COLUMN is_read SET NOT NULL;






CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
      AND role IN ('admin', 'marketing', 'engineer')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff()    FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin()    FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM public, anon;
GRANT EXECUTE ON FUNCTION public.is_staff()     TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin()     TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role()  TO authenticated;




DROP POLICY IF EXISTS "users_select_policy" ON public.users;
CREATE POLICY "users_select_policy" ON public.users
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff());



DROP POLICY IF EXISTS "users_update_policy" ON public.users;
CREATE POLICY "users_update_policy" ON public.users
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());





DROP POLICY IF EXISTS "projects_insert_policy" ON public.projects;
CREATE POLICY "projects_insert_policy" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "projects_update_policy" ON public.projects;
CREATE POLICY "projects_update_policy" ON public.projects
  FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "projects_delete_policy" ON public.projects;
CREATE POLICY "projects_delete_policy" ON public.projects
  FOR DELETE TO authenticated USING (public.get_my_role() IN ('admin', 'engineer'));


DROP POLICY IF EXISTS "stages_insert_policy" ON public.project_stages;
CREATE POLICY "stages_insert_policy" ON public.project_stages
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "stages_update_policy" ON public.project_stages;
CREATE POLICY "stages_update_policy" ON public.project_stages
  FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "stages_delete_policy" ON public.project_stages;
CREATE POLICY "stages_delete_policy" ON public.project_stages
  FOR DELETE TO authenticated USING (public.get_my_role() IN ('admin', 'engineer'));


DROP POLICY IF EXISTS "updates_insert_policy" ON public.stage_updates;
CREATE POLICY "updates_insert_policy" ON public.stage_updates
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "updates_delete_policy" ON public.stage_updates;
CREATE POLICY "updates_delete_policy" ON public.stage_updates
  FOR DELETE TO authenticated USING (public.get_my_role() IN ('admin', 'engineer'));


DROP POLICY IF EXISTS "files_insert_policy" ON public.project_files;
CREATE POLICY "files_insert_policy" ON public.project_files
  FOR INSERT TO authenticated WITH CHECK (public.is_staff());

DROP POLICY IF EXISTS "files_delete_policy" ON public.project_files;
CREATE POLICY "files_delete_policy" ON public.project_files
  FOR DELETE TO authenticated USING (public.is_staff());




CREATE OR REPLACE FUNCTION public.prevent_self_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role
     AND auth.uid() IS NOT NULL
     AND NOT public.is_admin()
  THEN
    RAISE EXCEPTION 'Perubahan role tidak diizinkan'
      USING ERRCODE = '42501',
            HINT = 'Perubahan role hanya dapat dilakukan oleh admin atau lewat service key.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_self_role_change ON public.users;
CREATE TRIGGER trg_prevent_self_role_change
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.prevent_self_role_change();





CREATE OR REPLACE FUNCTION public.sync_stage_updates_project_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.stage_id IS NOT NULL THEN
    SELECT ps.project_id INTO NEW.project_id
    FROM public.project_stages ps
    WHERE ps.id = NEW.stage_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_stage_updates_project_id ON public.stage_updates;
CREATE TRIGGER trg_sync_stage_updates_project_id
  BEFORE INSERT OR UPDATE ON public.stage_updates
  FOR EACH ROW EXECUTE FUNCTION public.sync_stage_updates_project_id();


CREATE OR REPLACE FUNCTION public.handle_new_booking_notification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.notifications (target_role, title, message, type, reference_id, is_read)
  VALUES (
    'admin',
    'Book Survey Baru',
    'Klien ' || COALESCE(NEW.full_name, 'Tamu') || ' telah mengajukan Book Survey untuk '
      || COALESCE(NEW.service_type, 'Survey') || '.',
    'book_survey',
    NEW.id::text,
    false
  );

  INSERT INTO public.notifications (target_role, title, message, type, reference_id, is_read)
  VALUES (
    'marketing',
    'Book Survey Baru Masuk',
    'Book Survey baru diterima dari ' || COALESCE(NEW.full_name, 'Tamu')
      || ' (' || COALESCE(NEW.service_type, 'Survey') || ').',
    'book_survey',
    NEW.id::text,
    false
  );

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_on_new_booking ON public.bookings;
CREATE TRIGGER trg_notify_on_new_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_booking_notification();




DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['projects', 'project_stages', 'stage_updates'] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t
    ) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;

ALTER TABLE public.project_stages REPLICA IDENTITY FULL;
ALTER TABLE public.stage_updates  REPLICA IDENTITY FULL;



NOTIFY pgrst, 'reload schema';
