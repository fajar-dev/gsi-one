BEGIN;
DROP POLICY IF EXISTS files_update_policy ON public.project_files;
CREATE POLICY files_update_policy ON public.project_files
  FOR UPDATE TO authenticated USING (public.is_staff()) WITH CHECK (public.is_staff());
NOTIFY pgrst, 'reload schema';
COMMIT;
