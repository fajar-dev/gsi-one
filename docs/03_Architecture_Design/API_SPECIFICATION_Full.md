# API & Repository Specification

[Spesifikasi API](API_Specification.md) merangkum jalur komunikasi yang aktif. Seluruh operasi aplikasi memakai Supabase SDK, PostgREST, RPC, Storage, Realtime, dan Edge Function.

## Kontrak autentikasi

- `authService.login({ email, password })`: menerima email atau nomor tiket pada field email; mengembalikan profil aplikasi dan access token Supabase.
- `authService.logout()`: menghapus profil tersimpan dan mengakhiri sesi.
- `authService.sendPasswordResetEmail(email)`: meminta email reset dari Supabase Auth.
- `authService.adminCreateUser(name, email, password, role)`: memanggil `admin-create-user`; fungsi memverifikasi admin dan menerima role client, marketing, atau engineer.
- Registrasi mandiri dari aplikasi dinonaktifkan. Konfigurasi signup di Supabase merupakan pengaturan terpisah.

## Kontrak proyek

`projectService` mendelegasikan ke `SupabaseProjectRepository` dengan empat sub-repository.

| Repository | Operasi |
| --- | --- |
| `ProjectQueryRepository` | `getProjects`, `getProjectDetail` |
| `ProjectCommandRepository` | `createProject`, `updateProject`, `deleteProject`, `getUsersByRole` |
| `ProjectStageRepository` | `createProjectStage`, `updateProjectStage`, `deleteProjectStage`, `updateStageStatus`, `addStageUpdate` |
| `ProjectFileRepository` | `uploadFile` |

Status proyek: `pending`, `on_progress`, `done`, `on_hold`. Status tahapan: `pending`, `in_progress`, `done`. Trigger `recalculate_project_status` menghitung status proyek dari tahapan dan mempertahankan `on_hold`.

Query daftar memakai filter penugasan menurut role di aplikasi. RLS tetap menjadi batas akses sebenarnya. Repository mendukung pagination; service/store daftar proyek belum meneruskan parameter pagination.

## Booking

`surveyService` menyediakan `getBookings`, `createBooking`, `claimBooking`, dan `deleteBooking` melalui `SupabaseSurveyRepository`. Booking publik masuk ke `bookings`; trigger membuat notifikasi admin dan marketing. Klaim menyimpan status, nama pengambil, dan waktu klaim.

## Berkas dan notifikasi

Upload mengirim konten langsung ke bucket `projects`, lalu menulis `project_files`. UI membuka URL yang disimpan. Service signed URL tersedia, tetapi belum digunakan pada alur pembukaan berkas. Migrasi terbaru menetapkan bucket publik.

Notifikasi dibaca berdasarkan penerima user atau role dan mendukung read/delete. Penulisan `createNotification` pada client merupakan no-op; pembuatan notifikasi harus melalui trigger database. Saat ini migrasi menyediakan trigger notifikasi booking.

## Sumber database

`supabase/migrations/` berisi perubahan skema/policy. `supabase/seed.sql` menyediakan data demo mandiri dalam transaksi; identitas akun, profil, proyek, tahapan, catatan, dan metadata foto dihubungkan dengan ID yang sesuai.
