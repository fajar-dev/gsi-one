# API Specification

## Jalur komunikasi

Aplikasi mengakses Supabase melalui SDK pada `src/config/supabase.ts`. Konfigurasi hanya memerlukan `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.

| Operasi | SDK / layanan | Lokasi implementasi |
| --- | --- | --- |
| Login email/password | `supabase.auth.signInWithPassword` | `src/services/authService.ts` |
| Resolusi tiket klien | RPC `get_email_by_ticket_number` | `src/services/authService.ts` |
| Pembuatan pengguna | `supabase.functions.invoke('admin-create-user')` | `supabase/functions/admin-create-user/index.ts` |
| Daftar/detail proyek | PostgREST tabel proyek dan relasinya | `src/services/repositories/sub/ProjectQueryRepository.ts` |
| Mutasi proyek | PostgREST `projects` | `ProjectCommandRepository.ts` |
| Tahapan dan catatan | PostgREST `project_stages`, `stage_updates` | `ProjectStageRepository.ts` |
| Upload | Storage bucket `projects` + metadata `project_files` | `ProjectFileRepository.ts` |
| Booking | PostgREST `bookings` | `SupabaseSurveyRepository.ts` |
| Notifikasi | PostgREST `notifications` | `src/services/notificationService.ts` |
| Realtime | Channel perubahan PostgreSQL per proyek | `src/hooks/useProjectRealtime.ts` |

## Otorisasi

SDK memakai sesi Supabase Auth; RLS PostgreSQL membatasi akses baris. Pemeriksaan role di UI tidak menggantikan RLS. Edge Function memvalidasi token dan mengambil role admin dari `public.users`.

## Error dan berkas

Service/repository memeriksa `error`; mutasi yang bisa tersaring RLS juga memeriksa baris hasil `.select('id')`. Berkas diunggah langsung ke Storage, lalu URL dan metadata dicatat di database. Konfigurasi bucket mengikuti migrasi, bukan asumsi pada UI.

Lihat [kontrak layanan lengkap](API_SPECIFICATION_Full.md) dan [katalog](API_Catalog_Documentation.md).
