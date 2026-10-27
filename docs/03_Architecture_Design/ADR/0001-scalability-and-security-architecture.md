# ADR 0001: Supabase sebagai layanan data aplikasi

## Status

Accepted; diperbarui 26 Oktober 2026.

## Keputusan

Aplikasi mengakses Supabase langsung melalui service dan repository. PostgreSQL menyimpan data bisnis dan menegakkan RLS. Auth menangani sesi; Storage menyimpan berkas; Realtime meneruskan perubahan proyek. Operasi pembuatan pengguna dilakukan oleh Edge Function `admin-create-user` yang memvalidasi role admin dari database.

## Batas akses

Filter UI dan query daftar bukan pengganti RLS. Policy saat ini mengizinkan staf membaca lintas proyek dan melakukan sejumlah mutasi yang lebih luas daripada kontrol UI. Klien mengakses proyek melalui UUID pemilik/pembuat.

Client tidak membuat notifikasi langsung. Trigger database membuat notifikasi booking; notifikasi untuk operasi proyek membutuhkan implementasi trigger tambahan.

## Performa dan pemetaan

Indeks meliputi penugasan proyek, status, urutan tahapan, serta waktu catatan dan notifikasi. `stage_updates.project_id` diisi trigger agar subscription dapat difilter per proyek. Pagination tersedia pada repository, tetapi belum sepenuhnya diteruskan oleh service daftar proyek.

`projectMapper.ts` menormalkan row daftar proyek; jalur detail masih memakai casting dan perlu dipertimbangkan pada refactoring selanjutnya.

## Konsekuensi

Satu sumber data bisnis berada di PostgreSQL Supabase. Operasi privileged terisolasi di Edge Function dan database. Perubahan akses perlu diuji di database dengan akun tiap peran; kelulusan test mock tidak membuktikan policy cloud.
