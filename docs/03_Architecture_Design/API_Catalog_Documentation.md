# API Catalog & Service Documentation
## Proyek: GSI One Mobile Application

## Katalog layanan aktif

| Modul | Lokasi | Tanggung jawab |
| --- | --- | --- |
| Proyek | `SupabaseProjectRepository` + `repositories/sub/` | Query/list/detail, command proyek, stage, dan file. |
| Mapper | `services/mappers/projectMapper.ts` | Konversi row database ke DTO/domain tanpa cast tak terkontrol. |
| Notifikasi | `notificationService.ts`, `notificationStore.ts` | Query berhalaman, read/delete dengan rollback optimistic state. |
| Storage | `storageService.ts` | Utilitas signed URL; alur UI saat ini membuka URL tersimpan. |
| Akun admin | `supabase/functions/admin-create-user/` | Validasi sesi admin dan pembuatan akun Auth. |
| Survei | `SupabaseSurveyRepository.ts` | Pembuatan dan pengelolaan booking survei. |

## Database dan policy utama

| Area | Tabel/bucket | Implementasi 30 Juli 2026 |
| --- | --- | --- |
| Kepemilikan proyek | `projects`, `project_stages`, `stage_updates`, `project_files` | RLS membaca berdasarkan UUID relasional (`client_id`, `created_by`), bukan nama client. |
| Notifikasi | `notifications` | Baca/mutasi hanya penerima user atau role; insert klien ditutup. Query menggunakan `limit`/`offset`. |
| Realtime | `stage_updates.project_id` | Trigger mengisi dan backfill `project_id`; channel difilter per proyek. |
| Performa | indeks proyek, stage, update, file, notifikasi | Indeks komposit sesuai pola filter dan urutan `created_at DESC`; stage memiliki unique `(project_id, sequence)`. |
| Berkas | Storage bucket `projects` | Migrasi terbaru menetapkan bucket publik; unggah untuk staf, UI membuka URL tersimpan. |
| Retention | `cleanup_old_read_notifications()` | Fungsi `SECURITY DEFINER` untuk menghapus notifikasi sudah dibaca setelah retensi default 30 hari; jadwalkan dengan pg_cron di produksi. |

Lihat [API Specification](API_SPECIFICATION_Full.md) untuk endpoint dan kontrak rinci, serta [ADR 0001](ADR/0001-scalability-and-security-architecture.md) untuk alasan desain.
