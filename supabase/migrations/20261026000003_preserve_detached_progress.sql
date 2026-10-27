BEGIN;
-- Older cloud installations used CASCADE while the reconciled schema uses
-- SET NULL. Keep the project history when a stage is removed.
DO $$
DECLARE fk record;
BEGIN
  FOR fk IN SELECT conname FROM pg_constraint
    WHERE conrelid = 'public.stage_updates'::regclass
      AND confrelid = 'public.project_stages'::regclass AND contype = 'f'
  LOOP
    EXECUTE format('ALTER TABLE public.stage_updates DROP CONSTRAINT %I', fk.conname);
  END LOOP;
END $$;
ALTER TABLE public.stage_updates ALTER COLUMN stage_id DROP NOT NULL;
ALTER TABLE public.stage_updates ADD CONSTRAINT stage_updates_stage_id_fkey
  FOREIGN KEY (stage_id) REFERENCES public.project_stages(id) ON DELETE SET NULL;
NOTIFY pgrst, 'reload schema';
COMMIT;
