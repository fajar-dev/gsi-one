# Developer Guide

## Lingkungan

- Node.js 20 atau lebih baru dan npm.
- JDK 17, Android SDK Platform 36, Build Tools 36.0.0, dan NDK 27.1.12297006 untuk Android.
- Xcode dan CocoaPods untuk iOS.
- Project Supabase yang telah dikonfigurasi dengan migrasi dan Edge Function.

```bash
npm ci
cp .env.example .env
```

Isi `SUPABASE_URL` dan `SUPABASE_ANON_KEY` pada `.env`.

## Menjalankan aplikasi

```bash
npm start
```

Pada terminal lain:

```bash
npm run android
```

Untuk perangkat Android lewat USB, pastikan USB debugging aktif dan pasang koneksi Metro:

```bash
adb devices
adb reverse tcp:8081 tcp:8081
```

iOS menggunakan `npm run ios`; web menggunakan `npm run web` pada port 8080. Komunikasi data langsung menuju Supabase.

## Database dan akun demo

`supabase/migrations/` berisi perubahan skema, trigger, dan RLS. `supabase/seed.sql` mengisi 4 akun, 3 proyek, 10 tahapan, 2 catatan, dan 1 metadata foto. Jalankan di SQL Editor setelah migrasi pada project yang dituju. Password akun baru adalah `password123`; akun lama tidak direset oleh seed.

Pendaftaran akun aplikasi memakai Edge Function `admin-create-user` yang memverifikasi sesi dan role admin sebelum memakai Auth Admin API.

## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm run test:ci
```

Pisahkan UI, hook/store, service, dan repository. Gunakan helper error bersama serta periksa hasil mutasi agar penolakan RLS tidak dilaporkan sebagai keberhasilan.
