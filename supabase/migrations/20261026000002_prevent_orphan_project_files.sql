BEGIN;
CREATE OR REPLACE FUNCTION public.guard_project_file_cleanup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.objects
    WHERE bucket_id = 'projects'
      AND split_part(name, '/', 1) IN (OLD.id::text, OLD.project_code)) THEN
    RAISE EXCEPTION 'Hapus berkas melalui aplikasi sebelum menghapus proyek.';
  END IF;
  DELETE FROM public.notifications WHERE reference_id = OLD.id::text
    AND type IN ('project_created', 'project_updated', 'stage_updated', 'file_uploaded', 'engineer_assigned');
  RETURN OLD;
END;
$$;
REVOKE ALL ON FUNCTION public.guard_project_file_cleanup() FROM PUBLIC;
DROP TRIGGER IF EXISTS trg_guard_project_file_cleanup ON public.projects;
CREATE TRIGGER trg_guard_project_file_cleanup BEFORE DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.guard_project_file_cleanup();
COMMIT;
