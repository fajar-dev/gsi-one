BEGIN;

-- Clients read the same project shape with a NULL budget. Direct reads of the
-- financial column are denied, including requests bypassing the application UI.
CREATE OR REPLACE VIEW public.projects_with_budget WITH (security_barrier = true) AS
SELECT id, project_code, project_name, client_name,
       CASE WHEN public.is_staff() THEN budget ELSE NULL END AS budget,
       start_date, estimated_finish, status, created_by, client_id,
       marketing_id, engineer_id, created_at
FROM public.projects
WHERE auth.uid() IS NOT NULL
  AND (public.is_staff() OR client_id = auth.uid() OR created_by = auth.uid());
REVOKE ALL ON public.projects_with_budget FROM PUBLIC, anon;
GRANT SELECT ON public.projects_with_budget TO authenticated;
REVOKE SELECT ON public.projects FROM PUBLIC, anon, authenticated;
REVOKE SELECT (budget) ON public.projects FROM PUBLIC, anon, authenticated;
DO $$
DECLARE safe_columns text;
BEGIN
  SELECT string_agg(quote_ident(attname), ', ') INTO safe_columns
  FROM pg_attribute WHERE attrelid = 'public.projects'::regclass
    AND attnum > 0 AND NOT attisdropped AND attname <> 'budget';
  EXECUTE 'GRANT SELECT (' || safe_columns || ') ON public.projects TO authenticated';
END $$;

UPDATE storage.buckets SET public = false WHERE id = 'projects';

-- Activity notifications run in the same transaction as the business change.
-- No client INSERT policy or service credential is needed in the mobile app.
CREATE OR REPLACE FUNCTION public.notify_project_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  p public.projects%ROWTYPE;
  pid bigint;
  notification_type text;
  activity text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW IS NOT DISTINCT FROM OLD THEN RETURN NEW; END IF;
  IF TG_TABLE_NAME = 'projects' THEN
    pid := NEW.id;
    notification_type := CASE WHEN TG_OP = 'INSERT' THEN 'project_created' ELSE 'project_updated' END;
    activity := CASE WHEN TG_OP = 'INSERT' THEN 'Proyek baru' ELSE 'Informasi proyek diperbarui' END;
  ELSIF TG_TABLE_NAME = 'project_files' THEN
    pid := NEW.project_id;
    notification_type := 'file_uploaded';
    activity := 'Berkas baru: ' || NEW.file_name;
  ELSIF TG_TABLE_NAME = 'project_stages' THEN
    pid := CASE WHEN TG_OP = 'DELETE' THEN OLD.project_id ELSE NEW.project_id END;
    notification_type := 'stage_updated';
    activity := CASE WHEN TG_OP = 'DELETE' THEN 'Tahapan dihapus' WHEN TG_OP = 'INSERT' THEN 'Tahapan baru' ELSE 'Tahapan diperbarui' END;
  ELSE
    pid := NEW.project_id;
    notification_type := 'stage_updated';
    activity := 'Catatan progres baru';
  END IF;
  SELECT * INTO p FROM public.projects WHERE id = pid;
  IF NOT FOUND THEN RETURN NULL; END IF;
  INSERT INTO public.notifications (user_id, target_role, title, message, type, reference_id, is_read)
  SELECT recipient, target, activity, activity || ' pada proyek "' || p.project_name || '".', notification_type, pid::text, false
  FROM (
    SELECT DISTINCT uid AS recipient, NULL::text AS target
    FROM unnest(ARRAY[p.client_id, p.engineer_id]) AS uid WHERE uid IS NOT NULL
    UNION ALL SELECT NULL::uuid, 'marketing'
    UNION ALL SELECT NULL::uuid, 'admin'
  ) AS recipients;
  RETURN NULL;
END;
$$;
REVOKE ALL ON FUNCTION public.notify_project_activity() FROM PUBLIC;
DROP TRIGGER IF EXISTS trg_notify_project_activity ON public.projects;
CREATE TRIGGER trg_notify_project_activity AFTER INSERT OR UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.notify_project_activity();
DROP TRIGGER IF EXISTS trg_notify_stage_activity ON public.project_stages;
CREATE TRIGGER trg_notify_stage_activity AFTER INSERT OR UPDATE OR DELETE ON public.project_stages
  FOR EACH ROW EXECUTE FUNCTION public.notify_project_activity();
DROP TRIGGER IF EXISTS trg_notify_progress_activity ON public.stage_updates;
CREATE TRIGGER trg_notify_progress_activity AFTER INSERT ON public.stage_updates
  FOR EACH ROW EXECUTE FUNCTION public.notify_project_activity();
DROP TRIGGER IF EXISTS trg_notify_file_activity ON public.project_files;
CREATE TRIGGER trg_notify_file_activity AFTER INSERT ON public.project_files
  FOR EACH ROW EXECUTE FUNCTION public.notify_project_activity();

CREATE OR REPLACE FUNCTION public.sync_client_profile_name()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF NEW.role = 'client' AND NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE public.projects SET client_name = NEW.name WHERE client_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.sync_client_profile_name() FROM PUBLIC;
DROP TRIGGER IF EXISTS trg_sync_client_profile_name ON public.users;
CREATE TRIGGER trg_sync_client_profile_name AFTER UPDATE OF name ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_client_profile_name();

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['project_files', 'notifications'] LOOP
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = t) THEN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    END IF;
  END LOOP;
END $$;
NOTIFY pgrst, 'reload schema';
COMMIT;
