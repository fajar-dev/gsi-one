# Deployment Guide

## Quality gates

Jalankan `npm ci`, `npm run lint`, `npm run typecheck`, dan `npm run test:ci`. Verifikasi login serta operasi tiap peran di lingkungan pengujian; test dengan mock tidak menggantikan pemeriksaan RLS pada database.

## Supabase

1. Pilih project yang sesuai dan terapkan migrasi dari `supabase/migrations/` secara berurutan.
2. Deploy `supabase/functions/admin-create-user/` dan verifikasi konfigurasi server serta daftar origin web.
3. Pastikan Auth, policy database, bucket `projects`, dan publikasi realtime sesuai kebutuhan aplikasi.
4. Isi `.env` aplikasi dengan `SUPABASE_URL` dan `SUPABASE_ANON_KEY` project tersebut.
5. Data demo tersedia di `supabase/seed.sql`; jalankan hanya bila data demo dibutuhkan.

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
