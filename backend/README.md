# ⚠️ ARSIP — Backend Express ini sudah tidak dipakai

**Status per 2026-10-06: diarsipkan (retired). Jangan deploy, jangan pakai untuk data baru.**

## Kenapa diarsipkan

Aplikasi GSI One sekarang berbicara **langsung ke Supabase** (PostgREST + RLS + Edge Functions).
Folder ini adalah backend Express lama dengan database SQLite sendiri, dan audit menemukan
bahwa ia tidak dapat berfungsi lagi:

1. **Menunjuk project Supabase yang salah.** `backend/.env` memakai
   `SUPABASE_URL=https://jvkoutfgqqfedbjanqen.supabase.co` — hostname itu **tidak bisa
   di-resolve** (project sudah tidak ada). Project yang sebenarnya dipakai aplikasi adalah
   `blysalihwznhzpufocus` (lihat `supabase/config.toml`).
   Akibatnya: `supabaseAdmin.auth.getUser()` tidak pernah bisa memverifikasi token aplikasi,
   sehingga hampir semua rute yang butuh autentikasi mengembalikan 403.

2. **Skema SQLite-nya tidak cocok dengan kodenya sendiri.** `database.js` hanya membuat 6 tabel
   (`users`, `bookings`, `projects`, `project_stages`, `stage_updates`, `project_files`) —
   **tidak ada tabel `notifications`** dan **tidak ada kolom `ticket_number`**. Padahal:
   - `routes/notificationRoutes.js` melakukan `INSERT INTO notifications …` → selalu
     `no such table: notifications` (HTTP 500).
   - `routes/authRoutes.js` melakukan `WHERE LOWER(ticket_number) = …` → selalu
     `no such column: ticket_number` (HTTP 500).

3. **Tidak ada yang membaca tulisannya.** Rute tulis (booking, berkas, notifikasi) menyimpan ke
   SQLite lokal, tetapi aplikasi hanya membaca dari Supabase. Tidak ada satu pun GET yang
   mengembalikan data itu, jadi isinya menjadi data yatim.

Karena itu semua pemanggilan `API_BASE_URL` dari aplikasi ke folder ini
(`/api/auth/lookup-ticket`, `/api/admin/create-user`) **sudah dihapus** dari
`src/services/authService.ts`.

## Yang masih berlaku di folder ini

Beberapa berkas tetap berguna sebagai referensi arsip, **bukan** sebagai kode yang dijalankan:

| Berkas | Keterangan |
|---|---|
| `supabase_schema.sql` | Definisi skema Postgres lengkap (versi aman `handle_new_user` ada di sini — lihat komentar SEC-CRIT-01). Sudah disalin ke migrasi `2026100600000[1-3]`. |
| `fix_booking_notifications.sql` | Berisi body trigger `handle_new_booking_notification`. **Hanya fungsinya** yang dipakai (di migrasi `20261006000001`); sisanya mengganti policy jadi `USING (true)` dan **tidak boleh** dijalankan. |
| `verify_rls.sql`, `update_rls_policies.sql`, `add_delete_policies.sql` | Skrip RLS manual yang **bertentangan** dengan migrasi Supabase. Jangan dijalankan. |

## Peringatan keamanan

`backend/.env` berisi **service secret** (`SUPABASE_SECRET_KEY`) dan `JWT_SECRET` milik project
lama, dan `android/gradle.properties` berisi password keystore rilis. Semuanya sudah masuk
`.gitignore` dan **tidak terlacak git**, tetapi tetap ada di salinan folder ini.

**Rotasi semuanya**: service secret, `JWT_SECRET`, dan keystore Android.

## Seeding

`database.js` tidak lagi menanam data otomatis saat server start. Untuk menanam data demo
sekarang harus eksplisit:

```bash
SEED_DEFAULT_DATA=true SEED_DEFAULT_PASSWORD='<password-pilihan-anda>' node server.js
```

`seed_data.js` (menulis ke Supabase) juga sudah dipagari:

```bash
SEED_CONFIRM=<project-ref> [SEED_ALLOW_DESTRUCTIVE=true] node seed_data.js
```

tanpa `SEED_CONFIRM` yang cocok, skrip berhenti sebelum menyentuh apa pun; tanpa
`SEED_ALLOW_DESTRUCTIVE=true` ia tidak menghapus proyek yang sudah ada.
