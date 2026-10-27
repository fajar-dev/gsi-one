BEGIN;
-- Remove older permissive SELECT policies, including client-name comparisons.
-- Detached history is authorized through project_id, not a deleted stage.
DO $$
DECLARE policy record;
BEGIN
  FOR policy IN SELECT schemaname, tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('projects','project_stages','stage_updates','project_files')
      AND cmd = 'SELECT'
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', policy.policyname, policy.schemaname, policy.tablename);
  END LOOP;
END $$;
CREATE POLICY projects_select_policy ON public.projects FOR SELECT TO authenticated
  USING (public.is_staff() OR client_id = auth.uid() OR created_by = auth.uid());
CREATE POLICY stages_select_policy ON public.project_stages FOR SELECT TO authenticated
  USING (public.is_staff() OR EXISTS (SELECT 1 FROM public.projects p
    WHERE p.id = project_stages.project_id AND (p.client_id = auth.uid() OR p.created_by = auth.uid())));
CREATE POLICY updates_select_policy ON public.stage_updates FOR SELECT TO authenticated
  USING (public.is_staff() OR EXISTS (SELECT 1 FROM public.projects p
    WHERE p.id = stage_updates.project_id AND (p.client_id = auth.uid() OR p.created_by = auth.uid())));
CREATE POLICY files_select_policy ON public.project_files FOR SELECT TO authenticated
  USING (public.is_staff() OR EXISTS (SELECT 1 FROM public.projects p
    WHERE p.id = project_files.project_id AND (p.client_id = auth.uid() OR p.created_by = auth.uid())));
NOTIFY pgrst, 'reload schema';
COMMIT;
