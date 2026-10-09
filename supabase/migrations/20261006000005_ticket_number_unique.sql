


DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'users_ticket_number_key'
      AND conrelid = 'public.users'::regclass
  ) THEN
    
    
    ALTER TABLE public.users
      ADD CONSTRAINT users_ticket_number_key UNIQUE (ticket_number);
  END IF;
END $$;
