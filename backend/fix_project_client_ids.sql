



UPDATE public.projects p
SET client_id = u.id
FROM public.users u
WHERE LOWER(TRIM(p.client_name)) = LOWER(TRIM(u.name))
  AND u.role = 'client'
  AND p.client_id IS NULL;


UPDATE public.projects p
SET client_name = u.name
FROM public.users u
WHERE p.client_id = u.id
  AND p.client_name IS DISTINCT FROM u.name;

