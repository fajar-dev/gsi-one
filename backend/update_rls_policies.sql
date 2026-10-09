



DROP POLICY IF EXISTS "Allow authenticated select" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.project_stages;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.stage_updates;
DROP POLICY IF EXISTS "Allow authenticated select" ON public.project_files;


CREATE POLICY "Allow select for staff and own projects" ON public.projects FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR client_id = auth.uid()
    OR client_name = (SELECT name FROM public.users WHERE id = auth.uid())
    OR created_by = auth.uid()
  );


CREATE POLICY "Allow select for staff and own stages" ON public.project_stages FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_stages.project_id
      AND (p.client_id = auth.uid() OR p.client_name = (SELECT name FROM public.users WHERE id = auth.uid()) OR p.created_by = auth.uid())
    )
  );


CREATE POLICY "Allow select for staff and own updates" ON public.stage_updates FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR EXISTS (
      SELECT 1 FROM public.project_stages s
      JOIN public.projects p ON p.id = s.project_id
      WHERE s.id = stage_updates.stage_id
      AND (p.client_id = auth.uid() OR p.client_name = (SELECT name FROM public.users WHERE id = auth.uid()) OR p.created_by = auth.uid())
    )
  );


CREATE POLICY "Allow select for staff and own files" ON public.project_files FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_files.project_id
      AND (p.client_id = auth.uid() OR p.client_name = (SELECT name FROM public.users WHERE id = auth.uid()) OR p.created_by = auth.uid())
    )
  );


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User Baru'),
    new.email,
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE FUNCTION public.sync_user_name_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.name IS DISTINCT FROM OLD.name THEN
    UPDATE public.projects
    SET client_name = NEW.name
    WHERE client_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_user_name_changes ON public.users;
CREATE TRIGGER trg_sync_user_name_changes
  AFTER UPDATE OF name ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_user_name_changes();



