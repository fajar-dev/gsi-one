



CREATE POLICY "Allow delete for admin and engineer" ON public.projects FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'engineer')));


CREATE POLICY "Allow delete for admin and engineer" ON public.project_stages FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'engineer')));


CREATE POLICY "Allow delete for admin and engineer" ON public.stage_updates FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'engineer')));


CREATE POLICY "Allow delete for staff" ON public.project_files FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer')));
