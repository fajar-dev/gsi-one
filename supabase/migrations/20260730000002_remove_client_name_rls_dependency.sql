





ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;


ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;


DROP POLICY IF EXISTS "Allow select for staff and own projects" ON public.projects;
DROP POLICY IF EXISTS "Allow select for staff and own stages" ON public.project_stages;
DROP POLICY IF EXISTS "Allow select for staff and own updates" ON public.stage_updates;
DROP POLICY IF EXISTS "Allow select for staff and own files" ON public.project_files;


CREATE POLICY "Allow select for staff and own projects" ON public.projects FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR client_id = auth.uid()
    OR created_by = auth.uid()
  );


CREATE POLICY "Allow select for staff and own stages" ON public.project_stages FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_stages.project_id
      AND (p.client_id = auth.uid() OR p.created_by = auth.uid())
    )
  );


CREATE POLICY "Allow select for staff and own updates" ON public.stage_updates FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR EXISTS (
      SELECT 1 FROM public.project_stages s
      JOIN public.projects p ON p.id = s.project_id
      WHERE s.id = stage_updates.stage_id
      AND (p.client_id = auth.uid() OR p.created_by = auth.uid())
    )
  );


CREATE POLICY "Allow select for staff and own files" ON public.project_files FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_files.project_id
      AND (p.client_id = auth.uid() OR p.created_by = auth.uid())
    )
  );