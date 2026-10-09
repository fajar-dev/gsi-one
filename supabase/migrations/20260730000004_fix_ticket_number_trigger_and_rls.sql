



CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'client',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS ticket_number TEXT;


ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;


CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, ticket_number)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'User Baru'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'client'),
    new.raw_user_meta_data->>'ticket_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    role = COALESCE(EXCLUDED.role, public.users.role),
    ticket_number = COALESCE(EXCLUDED.ticket_number, public.users.ticket_number);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


DROP POLICY IF EXISTS "users_update_policy" ON public.users;
CREATE POLICY "users_update_policy" ON public.users 
  FOR UPDATE TO authenticated
  USING (
    id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
  )
  WITH CHECK (
    id = auth.uid() 
    OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'marketing', 'engineer'))
  );


CREATE OR REPLACE FUNCTION public.get_email_by_ticket_number(p_ticket TEXT)
RETURNS TEXT AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email
  FROM public.users
  WHERE LOWER(ticket_number) = LOWER(TRIM(p_ticket))
  LIMIT 1;

  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_email_by_ticket_number(TEXT) TO anon, authenticated;


UPDATE public.users u
SET ticket_number = au.raw_user_meta_data->>'ticket_number'
FROM auth.users au
WHERE u.id = au.id
  AND (u.ticket_number IS NULL OR u.ticket_number = '')
  AND au.raw_user_meta_data->>'ticket_number' IS NOT NULL;