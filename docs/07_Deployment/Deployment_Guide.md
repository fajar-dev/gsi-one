# Deployment Guide

## Quality gates

Jalankan `npm ci`, `npm run lint`, `npm run typecheck`, dan `npm run test:ci`. Verifikasi login serta operasi tiap peran di lingkungan pengujian; test dengan mock tidak menggantikan pemeriksaan RLS pada database.

## Supabase

1. Pilih project yang sesuai dan terapkan migrasi dari `supabase/migrations/` secara berurutan.
2. Deploy `supabase/functions/admin-create-user/` dan verifikasi konfigurasi server serta daftar origin web.
3. Pastikan Auth, policy database, bucket `projects`, dan publikasi realtime sesuai kebutuhan aplikasi.
4. Isi `.env` aplikasi dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` project tersebut.
5. Data demo tersedia di `supabase/seed.sql`; jalankan hanya bila data demo dibutuhkan.

### Cron harian untuk Supabase Free

Terapkan migrasi `20261116000000_add_keepalive_rpc.sql` ke project Supabase yang dipakai aplikasi. Migrasi menambahkan RPC `gsi_keepalive` yang hanya menjalankan `SELECT 1` tanpa membaca tabel aplikasi.

Jalankan perintah berikut dari root repo pada host Linux yang selalu aktif dan sudah menjalankan layanan cron serta memiliki `curl`.

```bash
sudo install -d -m 0755 /usr/local/libexec/gsi-one
sudo install -d -m 0700 /etc/gsi-one
sudo install -o root -g root -m 0755 scripts/supabase-keepalive.sh /usr/local/libexec/gsi-one/supabase-keepalive.sh
sudoedit /etc/gsi-one/supabase-keepalive.env
sudo chmod 0600 /etc/gsi-one/supabase-keepalive.env
```

Isi file tersebut dengan URL dan publishable key (atau legacy anon key) project. File dibaca sebagai konfigurasi shell oleh cron, jadi pastikan hanya root yang dapat mengubahnya.

```sh
SUPABASE_URL='https://PROJECT_REF.supabase.co'
SUPABASE_ANON_KEY='sb_publishable_...'
```

Jalankan verifikasi manual. Jika berhasil, perintah selesai dengan status 0 tanpa output. Setelah itu, pasang jadwalnya.

```bash
sudo /bin/sh /usr/local/libexec/gsi-one/supabase-keepalive.sh &&
  sudo install -o root -g root -m 0644 deploy/cron.d/gsi-one-supabase-keepalive /etc/cron.d/gsi-one-supabase-keepalive
```

Job berjalan setiap hari pukul 03.00 menurut zona waktu layanan cron. Supabase tetap bisa menjeda project Free jika aktivitas database dinilai terlalu rendah. [Kebijakan Supabase](https://supabase.com/docs/guides/platform/free-project-pausing)

## Build Android

Siapkan SDK/JDK dan signing key rilis sebelum menjalankan:

```bash
cd android
./gradlew bundleRelease
./gradlew assembleRelease
```

AAB: `android/app/build/outputs/bundle/release/app-release.aab`.
APK: `android/app/build/outputs/apk/release/app-release.apk`.

## Verifikasi rilis

- Login admin, marketing, engineer, dan klien.
- Pembuatan akun melalui Edge Function.
- Booking, daftar proyek, mutasi tahapan, catatan, upload, dan pembukaan berkas.
- Realtime pada detail proyek dan isolasi data antar-klien.

Tidak ada proses server aplikasi terpisah untuk di-deploy. Distribusi iOS memakai Xcode/App Store Connect; web memakai bundle React Native Web.
