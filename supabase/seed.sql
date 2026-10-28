-- Data demo GSI One, disalin dan disesuaikan dari backend/seed_data.js.
-- File ini mandiri: tidak menjalankan JavaScript, SQLite, atau seeder lama.
-- Jalankan setelah seluruh migration, melalui Supabase SQL Editor.
-- Setelah SQL selesai, jalankan npm run seed:storage untuk mengunggah foto demo privat.
-- Supabase CLI juga memuatnya saat reset database lokal (lihat config.toml).
-- Akun baru memakai password pada data akun, atau password123 jika tidak diisi.
-- Password akun lama dipertahankan kecuali data akun menyebut password eksplisit.
-- Tidak menghapus data. Pengulangan memperbarui akun/proyek/tahapan demo yang sama.
-- URL foto merupakan contoh dari sumber, bukan unggahan ke Supabase Storage.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;
SET LOCAL search_path = public, extensions;

DO $seed$
DECLARE
  v_user jsonb;
  v_project jsonb;
  v_stage jsonb;
  v_update jsonb;
  v_file jsonb;
  v_user_id uuid;
  v_user_ids jsonb := '{}'::jsonb;
  v_ticket text;
  v_ticket_sequence integer;
  v_project_id bigint;
  v_stage_id bigint;
  v_matches integer;
BEGIN
  -- Empat akun yang sama dengan sumber. Identitas Auth dan profil aplikasi
  -- disimpan bersama agar trigger handle_new_user yang memaksa role client
  -- tidak menghilangkan role staf pada data demo.
  FOR v_user IN SELECT value FROM jsonb_array_elements($users$[
    {"email":"admin@grahasurvei.com","name":"Admin GSI","role":"admin"},
    {"email":"marketing@grahasurvei.com","name":"Rian Marketing","role":"marketing"},
    {"email":"engineer@grahasurvei.com","name":"Heri Engineer","role":"engineer"},
    {"email":"reviewer.gsi@gmail.com","name":"Reviewer","role":"client","password":"ReviewGSI2025!"}
  ]$users$::jsonb)
  LOOP
    SELECT count(*) INTO v_matches FROM auth.users
    WHERE lower(email) = lower(v_user->>'email');
    IF v_matches > 1 THEN
      RAISE EXCEPTION 'Email akun demo duplikat: %', v_user->>'email';
    END IF;

    SELECT id INTO v_user_id FROM auth.users
    WHERE lower(email) = lower(v_user->>'email');

    v_ticket := NULL;
    IF v_user->>'role' = 'client' THEN
      SELECT ticket_number INTO v_ticket FROM public.users WHERE id = v_user_id;
      IF NULLIF(v_ticket, '') IS NULL THEN
        -- Jangan mengambil tiket yang sudah dimiliki akun lain saat seed diulang.
        v_ticket_sequence := 1;
        LOOP
          v_ticket := 'GSI-2026-' || lpad(v_ticket_sequence::text, 6, '0');
          EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE ticket_number = v_ticket);
          v_ticket_sequence := v_ticket_sequence + 1;
        END LOOP;
      END IF;
    END IF;

    IF v_user_id IS NULL THEN
      v_user_id := gen_random_uuid();
      INSERT INTO auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at, confirmation_token, recovery_token,
        email_change_token_new, email_change
      ) VALUES (
        '00000000-0000-0000-0000-000000000000', v_user_id,
        'authenticated', 'authenticated', v_user->>'email',
        crypt(COALESCE(v_user->>'password', 'password123'), gen_salt('bf')), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('full_name', v_user->>'name', 'role', v_user->>'role')
          || CASE WHEN v_ticket IS NULL THEN '{}'::jsonb
                  ELSE jsonb_build_object('ticket_number', v_ticket) END,
        now(), now(), '', '', '', ''
      );
    ELSE
      -- Hanya password eksplisit pada data akun yang diperbarui.
      UPDATE auth.users SET
        encrypted_password = CASE WHEN v_user ? 'password'
          THEN crypt(v_user->>'password', gen_salt('bf'))
          ELSE encrypted_password END,
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb)
          || jsonb_build_object('full_name', v_user->>'name', 'role', v_user->>'role')
          || CASE WHEN v_ticket IS NULL THEN '{}'::jsonb
                  ELSE jsonb_build_object('ticket_number', v_ticket) END,
        updated_at = now()
      WHERE id = v_user_id;
    END IF;

    INSERT INTO auth.identities (
      id, user_id, provider_id, identity_data, provider, created_at, updated_at
    )
    SELECT gen_random_uuid(), v_user_id, v_user_id::text,
      jsonb_build_object('sub', v_user_id::text, 'email', v_user->>'email',
                         'email_verified', true, 'phone_verified', false),
      'email', now(), now()
    WHERE NOT EXISTS (
      SELECT 1 FROM auth.identities WHERE user_id = v_user_id AND provider = 'email'
    );

    -- Trigger Auth biasanya sudah membuat profil. Perbarui langsung agar tidak
    -- menjalankan trigger BEFORE INSERT profil untuk akun yang sudah ada.
    UPDATE public.users SET
      name = v_user->>'name', email = v_user->>'email', role = v_user->>'role',
      ticket_number = COALESCE(v_ticket, ticket_number)
    WHERE id = v_user_id;
    IF NOT FOUND THEN
      INSERT INTO public.users (id, name, email, role, ticket_number)
      VALUES (v_user_id, v_user->>'name', v_user->>'email', v_user->>'role', v_ticket);
    END IF;

    v_user_ids := v_user_ids || jsonb_build_object(v_user->>'role', v_user_id::text);
  END LOOP;

  FOR v_project IN SELECT value FROM jsonb_array_elements($projects$[
    {
      "project_code":"PRJ-NDT-001",
      "project_name":"Non-Destructive Testing Ruko 3 Lantai",
      "client_name":"Reviewer (PT Mulia Jaya)",
      "budget":85000000,"start_date":"2026-07-01","estimated_finish":"2026-07-25",
      "status":"on_progress","created_by_role":"marketing",
      "stages":[
        {"title":"Penandatanganan Kontrak","description":"Negosiasi harga dan tanda tangan kontrak kerja sama NDT.","sequence":1,"status":"done","updated_by_role":"admin"},
        {"title":"Survey & Scanning Beton","description":"Melakukan UPV (Ultrasonic Pulse Velocity) & Rebound Hammer Test.","sequence":2,"status":"in_progress","updated_by_role":"engineer",
          "updates":[{"description":"Scanning kolom lantai 1 selesai dilakukan. Siap lanjut ke lantai 2.","progress":40,"created_by_role":"engineer"}],
          "files":[{"file_name":"Dokumentasi_Survey_Lantai1.jpg","file_url":"seed-documentation.jpg","file_type":"image","uploaded_by_role":"engineer"}]},
        {"title":"Analisis & Rekomendasi","description":"Pengolahan data uji dan penyusunan laporan rekomendasi struktur.","sequence":3,"status":"pending","updated_by_role":"engineer"}
      ]
    },
    {
      "project_code":"PRJ-SHMS-002",
      "project_name":"Structural Health Monitoring System Jembatan Baja",
      "client_name":"Reviewer (Dinas Pekerjaan Umum)",
      "budget":420000000,"start_date":"2026-06-15","estimated_finish":"2026-08-15",
      "status":"on_progress","created_by_role":"admin",
      "stages":[
        {"title":"Desain Peletakan Sensor","description":"Perencanaan posisi sensor regangan, akselerometer, dan temperatur.","sequence":1,"status":"done","updated_by_role":"admin"},
        {"title":"Instalasi Kabel & Sensor","description":"Pemasangan sensor fisik dan penarikan kabel fiber optik di sepanjang bentang jembatan.","sequence":2,"status":"in_progress","updated_by_role":"engineer",
          "updates":[{"description":"Pemasangan kabel fiber optik di bentang utama selesai 80%.","progress":60,"created_by_role":"engineer"}]},
        {"title":"Uji Coba Transmisi Data","description":"Kalibrasi sinyal sensor dan pengiriman telemetry data ke server pusat.","sequence":3,"status":"pending","updated_by_role":"engineer"},
        {"title":"Serah Terima & Pelatihan","description":"Pelatihan operator dinas PU dan serah terima dokumen manual penggunaan.","sequence":4,"status":"pending","updated_by_role":"admin"}
      ]
    },
    {
      "project_code":"PRJ-LOAD-003",
      "project_name":"Loading Test Jembatan Tol Cikampek",
      "client_name":"PT Jasa Marga",
      "budget":150000000,"start_date":"2026-08-01","estimated_finish":"2026-08-10",
      "status":"pending","created_by_role":"marketing",
      "stages":[
        {"title":"Persiapan Beban Truk","description":"Menimbang truk penguji dengan beban penuh pasir/batu sesuai standar SNI.","sequence":1,"status":"pending","updated_by_role":"engineer"},
        {"title":"Pengujian Statik & Dinamik","description":"Pemberian beban bertahap pada jembatan dan pembacaan lendutan.","sequence":2,"status":"pending","updated_by_role":"engineer"},
        {"title":"Laporan Hasil Uji Beban","description":"Analisis kapasitas beban layak jembatan tol.","sequence":3,"status":"pending","updated_by_role":"engineer"}
      ]
    }
  ]$projects$::jsonb)
  LOOP
    SELECT count(*) INTO v_matches FROM public.projects
    WHERE project_code = v_project->>'project_code';
    IF v_matches > 1 THEN
      RAISE EXCEPTION 'Kode proyek demo duplikat: %', v_project->>'project_code';
    END IF;

    SELECT id INTO v_project_id FROM public.projects
    WHERE project_code = v_project->>'project_code';

    IF v_project_id IS NULL THEN
      INSERT INTO public.projects (
        project_code, project_name, client_name, budget, start_date,
        estimated_finish, status, created_by, client_id, marketing_id, engineer_id
      ) VALUES (
        v_project->>'project_code', v_project->>'project_name', v_project->>'client_name',
        (v_project->>'budget')::numeric, (v_project->>'start_date')::date,
        (v_project->>'estimated_finish')::date, v_project->>'status',
        (v_user_ids->>(v_project->>'created_by_role'))::uuid,
        (v_user_ids->>'client')::uuid, (v_user_ids->>'marketing')::uuid,
        (v_user_ids->>'engineer')::uuid
      ) RETURNING id INTO v_project_id;
    ELSE
      UPDATE public.projects SET
        project_name = v_project->>'project_name',
        client_name = v_project->>'client_name', budget = (v_project->>'budget')::numeric,
        start_date = (v_project->>'start_date')::date,
        estimated_finish = (v_project->>'estimated_finish')::date,
        status = v_project->>'status',
        created_by = (v_user_ids->>(v_project->>'created_by_role'))::uuid,
        client_id = (v_user_ids->>'client')::uuid,
        marketing_id = (v_user_ids->>'marketing')::uuid,
        engineer_id = (v_user_ids->>'engineer')::uuid
      WHERE id = v_project_id;
    END IF;

    FOR v_stage IN SELECT value FROM jsonb_array_elements(v_project->'stages')
    LOOP
      SELECT count(*) INTO v_matches FROM public.project_stages
      WHERE project_id = v_project_id AND sequence = (v_stage->>'sequence')::integer;
      IF v_matches > 1 THEN
        RAISE EXCEPTION 'Urutan tahapan demo duplikat pada proyek %', v_project->>'project_code';
      END IF;

      SELECT id INTO v_stage_id FROM public.project_stages
      WHERE project_id = v_project_id AND sequence = (v_stage->>'sequence')::integer;

      IF v_stage_id IS NULL THEN
        INSERT INTO public.project_stages (
          project_id, title, description, sequence, status, updated_by
        ) VALUES (
          v_project_id, v_stage->>'title', v_stage->>'description',
          (v_stage->>'sequence')::integer, v_stage->>'status',
          (v_user_ids->>(v_stage->>'updated_by_role'))::uuid
        ) RETURNING id INTO v_stage_id;
      ELSE
        UPDATE public.project_stages SET
          title = v_stage->>'title', description = v_stage->>'description',
          status = v_stage->>'status',
          updated_by = (v_user_ids->>(v_stage->>'updated_by_role'))::uuid, updated_at = now()
        WHERE id = v_stage_id;
      END IF;

      FOR v_update IN SELECT value FROM jsonb_array_elements(COALESCE(v_stage->'updates', '[]'::jsonb))
      LOOP
        INSERT INTO public.stage_updates (stage_id, project_id, description, progress, created_by)
        SELECT v_stage_id, v_project_id, v_update->>'description',
          (v_update->>'progress')::integer, (v_user_ids->>(v_update->>'created_by_role'))::uuid
        WHERE NOT EXISTS (
          SELECT 1 FROM public.stage_updates WHERE stage_id = v_stage_id
            AND description = v_update->>'description'
            AND progress IS NOT DISTINCT FROM (v_update->>'progress')::integer
        );
      END LOOP;

      FOR v_file IN SELECT value FROM jsonb_array_elements(COALESCE(v_stage->'files', '[]'::jsonb))
      LOOP
        INSERT INTO public.project_files (
          project_id, stage_id, file_name, file_url, file_type, uploaded_by
        )
        SELECT v_project_id, v_stage_id, v_file->>'file_name', v_project_id::text || '/' || (v_file->>'file_url'),
          v_file->>'file_type', (v_user_ids->>(v_file->>'uploaded_by_role'))::uuid
        WHERE NOT EXISTS (
          SELECT 1 FROM public.project_files WHERE project_id = v_project_id
            AND stage_id = v_stage_id AND file_name = v_file->>'file_name'
        );
        UPDATE public.project_files
          SET file_url = v_project_id::text || '/' || (v_file->>'file_url')
          WHERE project_id = v_project_id AND stage_id = v_stage_id
            AND file_name = v_file->>'file_name'
            AND file_url = 'https://grahasurvei.com/uploads/' || 'sample_survey.jpg';
      END LOOP;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Seed selesai: 4 akun, 3 proyek, 10 tahapan, 2 catatan, 1 metadata foto.';
END;
$seed$;

COMMIT;
