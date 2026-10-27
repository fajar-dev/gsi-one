


-- Menghitung status proyek di database, supaya
-- projects.status tidak lagi nyangkut di 'pending' saat semua tahapan sudah 'done'.
--
-- SENGAJA: status 'on_hold' tidak pernah ditimpa otomatis -- itu keputusan manual
-- admin (pekerjaan ditunda) dan tidak boleh hilang diam-diam saat tahapan berubah.

CREATE OR REPLACE FUNCTION public.recalculate_project_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_project_id bigint;
  v_total      integer;
  v_done       integer;
  v_pending    integer;
  v_current    text;
  v_new        text;
BEGIN
  v_project_id := COALESCE(NEW.project_id, OLD.project_id);
  IF v_project_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT count(*),
         count(*) FILTER (WHERE ps.status = 'done'),
         count(*) FILTER (WHERE ps.status = 'pending')
    INTO v_total, v_done, v_pending
    FROM public.project_stages ps
   WHERE ps.project_id = v_project_id;

  SELECT p.status INTO v_current
    FROM public.projects p
   WHERE p.id = v_project_id;

  
  
  IF v_current IS NULL OR v_current = 'on_hold' THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  IF v_total = 0 OR v_pending = v_total THEN
    v_new := 'pending';
  ELSIF v_done = v_total THEN
    v_new := 'done';
  ELSE
    v_new := 'on_progress';
  END IF;

  IF v_new IS DISTINCT FROM v_current THEN
    UPDATE public.projects SET status = v_new WHERE id = v_project_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$;



DROP TRIGGER IF EXISTS trg_recalculate_project_status ON public.project_stages;
CREATE TRIGGER trg_recalculate_project_status
  AFTER INSERT OR UPDATE OF status OR DELETE ON public.project_stages
  FOR EACH ROW EXECUTE FUNCTION public.recalculate_project_status();
