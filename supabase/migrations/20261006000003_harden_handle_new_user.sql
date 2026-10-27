


-- handle_new_user() sebelumnya menyalin raw_user_meta_data->>'role' apa adanya.
-- Karena pendaftaran mandiri terbuka (disable_signup=false), siapa pun bisa
-- mendaftar dengan {"role":"admin"} dan mendapat is_admin()=true.
-- Versi ini memakai role 'client' tetap untuk setiap akun Auth baru.
-- Alur admin-create-user tetap benar karena meng-upsert role setelah createUser.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, name, email, role, ticket_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'User Baru'),
    NEW.email,
    
    'client',
    NEW.raw_user_meta_data->>'ticket_number'
  )
  ON CONFLICT (id) DO UPDATE SET
    name  = EXCLUDED.name,
    email = EXCLUDED.email,
    ticket_number = COALESCE(EXCLUDED.ticket_number, public.users.ticket_number);
    
    
  RETURN NEW;
END;
$$;
