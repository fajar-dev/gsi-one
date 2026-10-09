




INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;



DROP POLICY IF EXISTS "Public Select Policy for Projects Bucket"       ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload Policy for Projects Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Policy for Projects Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Policy for Projects Bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated select project files"       ON storage.objects;
DROP POLICY IF EXISTS "Allow staff upload project files"               ON storage.objects;
DROP POLICY IF EXISTS "Allow staff update project files"               ON storage.objects;
DROP POLICY IF EXISTS "Allow staff delete project files"               ON storage.objects;





CREATE POLICY "Allow authenticated select project files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'projects'
    AND (
      public.is_staff()
      OR EXISTS (
        SELECT 1 FROM public.projects p
        WHERE (p.id::text = (storage.foldername(name))[1]
               OR p.project_code = (storage.foldername(name))[1])
          AND (p.client_id = auth.uid() OR p.created_by = auth.uid())
      )
    )
  );

CREATE POLICY "Allow staff upload project files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'projects' AND public.is_staff());


CREATE POLICY "Allow staff update project files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'projects' AND public.is_staff())
  WITH CHECK (bucket_id = 'projects' AND public.is_staff());

CREATE POLICY "Allow staff delete project files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'projects' AND public.is_staff());
