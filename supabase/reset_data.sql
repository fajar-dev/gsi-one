-- DESTRUKTIF: fragmen ini menghapus seluruh data aplikasi dan akun Auth.
-- Gunakan npm run seed:prepare-reset untuk menggabungkannya dengan seed.sql
-- dalam SATU transaksi. Jangan menjalankan fragmen ini secara terpisah.
-- Hapus semua objek melalui Storage API terlebih dahulu; jangan menghapus
-- storage.objects lewat SQL karena berkas fisiknya akan menjadi yatim.
-- Skema, RLS, bucket, konfigurasi provider/SMTP, dan riwayat migrasi dipertahankan.

DO $reset$
DECLARE
  v_tables text;
BEGIN
  IF EXISTS (SELECT 1 FROM storage.objects) THEN
    RAISE EXCEPTION 'Storage belum kosong. Hapus seluruh objek melalui Storage API terlebih dahulu.';
  END IF;

  SELECT string_agg(format('%I.%I', n.nspname, c.relname), ', ' ORDER BY n.nspname, c.relname)
    INTO v_tables
  FROM pg_class c
  JOIN pg_namespace n ON n.oid = c.relnamespace
  WHERE c.relkind IN ('r', 'p') AND NOT c.relispartition
    AND (
      n.nspname = 'public'
      OR (n.nspname = 'auth' AND c.relname = ANY (ARRAY[
        'users', 'identities', 'sessions', 'refresh_tokens', 'audit_log_entries',
        'flow_state', 'one_time_tokens', 'mfa_factors', 'mfa_challenges',
        'mfa_amr_claims', 'saml_relay_states', 'oauth_authorizations',
        'oauth_consents', 'oauth_client_states', 'mfa_recovery_code_sets',
        'mfa_recovery_codes', 'webauthn_challenges', 'webauthn_credentials',
        'scim_users'
      ]))
    );

  IF v_tables IS NULL THEN
    RAISE EXCEPTION 'Tidak ditemukan tabel aplikasi/Auth; reset dibatalkan.';
  END IF;
  -- SQL Editor memiliki izin TRUNCATE, tetapi bukan pemilik sequence Auth.
  -- Pertahankan counter ID: seluruh baris tetap terhapus, tanpa ALTER sequence
  -- internal atau perubahan ownership milik layanan Supabase.
  EXECUTE 'TRUNCATE TABLE ' || v_tables || ' CONTINUE IDENTITY CASCADE';
END;
$reset$;
