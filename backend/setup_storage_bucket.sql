



INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO UPDATE SET public = true;




DROP POLICY IF EXISTS "Public Select Policy for Projects Bucket" ON storage.objects;


DROP POLICY IF EXISTS "Authenticated Upload Policy for Projects Bucket" ON storage.objects;
CREATE POLICY "Authenticated Upload Policy for Projects Bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'projects');


DROP POLICY IF EXISTS "Authenticated Update Policy for Projects Bucket" ON storage.objects;
CREATE POLICY "Authenticated Update Policy for Projects Bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'projects');


DROP POLICY IF EXISTS "Authenticated Delete Policy for Projects Bucket" ON storage.objects;
CREATE POLICY "Authenticated Delete Policy for Projects Bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'projects');
