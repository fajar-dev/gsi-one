BEGIN;

CREATE FUNCTION public.gsi_keepalive()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT 1;
$$;

REVOKE ALL ON FUNCTION public.gsi_keepalive() FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.gsi_keepalive() TO anon;

COMMIT;
