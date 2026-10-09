



CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('admin', 'marketing', 'engineer')
  );
$$;

CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;


DO $$ 
DECLARE 
    pol record;
BEGIN 
    FOR pol IN 
        SELECT tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename IN ('users', 'bookings', 'projects', 'project_stages', 'stage_updates', 'project_files')
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
    END LOOP;
END $$;


ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;


CREATE POLICY "users_select_policy" ON public.users 
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_staff());

CREATE POLICY "users_update_policy" ON public.users 
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());


CREATE POLICY "projects_select_policy" ON public.projects 
  FOR SELECT TO authenticated
  USING (
    public.is_staff() 
    OR client_name = (SELECT name FROM public.users WHERE id = auth.uid())
    OR created_by = auth.uid()
  );

CREATE POLICY "projects_insert_policy" ON public.projects 
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "projects_update_policy" ON public.projects 
  FOR UPDATE TO authenticated
  USING (public.is_staff());

CREATE POLICY "projects_delete_policy" ON public.projects 
  FOR DELETE TO authenticated
  USING (public.get_my_role() IN ('admin', 'engineer'));


CREATE POLICY "stages_select_policy" ON public.project_stages 
  FOR SELECT TO authenticated
  USING (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_stages.project_id
      AND (p.client_name = (SELECT name FROM public.users WHERE id = auth.uid()) OR p.created_by = auth.uid())
    )
  );

CREATE POLICY "stages_insert_policy" ON public.project_stages 
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "stages_update_policy" ON public.project_stages 
  FOR UPDATE TO authenticated
  USING (public.is_staff());

CREATE POLICY "stages_delete_policy" ON public.project_stages 
  FOR DELETE TO authenticated
  USING (public.get_my_role() IN ('admin', 'engineer'));


CREATE POLICY "updates_select_policy" ON public.stage_updates 
  FOR SELECT TO authenticated
  USING (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.project_stages s
      JOIN public.projects p ON p.id = s.project_id
      WHERE s.id = stage_updates.stage_id
      AND (p.client_name = (SELECT name FROM public.users WHERE id = auth.uid()) OR p.created_by = auth.uid())
    )
  );

CREATE POLICY "updates_insert_policy" ON public.stage_updates 
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "updates_delete_policy" ON public.stage_updates 
  FOR DELETE TO authenticated
  USING (public.get_my_role() IN ('admin', 'engineer'));


CREATE POLICY "files_select_policy" ON public.project_files 
  FOR SELECT TO authenticated
  USING (
    public.is_staff()
    OR EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_files.project_id
      AND (p.client_name = (SELECT name FROM public.users WHERE id = auth.uid()) OR p.created_by = auth.uid())
    )
  );

CREATE POLICY "files_insert_policy" ON public.project_files 
  FOR INSERT TO authenticated
  WITH CHECK (public.is_staff());

CREATE POLICY "files_delete_policy" ON public.project_files 
  FOR DELETE TO authenticated
  USING (public.is_staff());


CREATE POLICY "bookings_insert_public" ON public.bookings 
  FOR INSERT TO public 
  WITH CHECK (true);

CREATE POLICY "bookings_select_staff" ON public.bookings 
  FOR SELECT TO authenticated
  USING (public.is_staff());

CREATE POLICY "bookings_update_staff" ON public.bookings 
  FOR UPDATE TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "bookings_delete_admin" ON public.bookings 
  FOR DELETE TO authenticated
  USING (public.get_my_role() = 'admin');
