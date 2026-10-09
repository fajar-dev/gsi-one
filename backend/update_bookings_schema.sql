



DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'claimed_by') THEN
        ALTER TABLE public.bookings ADD COLUMN claimed_by VARCHAR(255);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'claimed_at') THEN
        ALTER TABLE public.bookings ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;


ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pending', 'claimed', 'approved', 'rejected'));


DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'ticket_number') THEN
        ALTER TABLE public.users ADD COLUMN ticket_number VARCHAR(100) UNIQUE;
    END IF;
END $$;


CREATE OR REPLACE FUNCTION public.get_email_by_ticket_number(p_ticket text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email
  FROM public.users
  WHERE LOWER(ticket_number) = LOWER(TRIM(p_ticket))
  LIMIT 1;

  RETURN v_email;
END;
$$;


GRANT EXECUTE ON FUNCTION public.get_email_by_ticket_number(text) TO anon, authenticated, service_role;



