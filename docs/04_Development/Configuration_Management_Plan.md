# Configuration Management Plan

## Item konfigurasi

| Item | Lokasi |
| --- | --- |
| Dependency aplikasi | `package.json`, `package-lock.json` |
| Konfigurasi client Supabase | `.env`, `.env.example`, `src/config/supabase.ts` |
| Tipe environment | `src/types/env.d.ts` |
| Bundler native / web | `babel.config.js`, `metro.config.js`, `webpack.config.js` |
| Android / iOS | `android/`, `ios/` |
| Database, policy, trigger | `supabase/migrations/` |
| Data demo | `supabase/seed.sql` |
| Operasi admin | `supabase/functions/admin-create-user/` |
| Pemeriksaan CI | `.github/workflows/ci.yml` |

## Environment

Development, staging, dan produksi memakai project Supabase masing-masing. Set `SUPABASE_URL` dan `SUPABASE_ANON_KEY` sesuai target, lalu bangun ulang bundle. `.env` tidak dilacak Git.

Kredensial server Edge Function dikelola pada Supabase. Signing key mobile disimpan di secret manager. Jangan menaruh service-role key atau password database dalam bundle client.

## Perubahan

Perubahan skema dilakukan lewat migrasi baru, disertai pemeriksaan dampak RLS, relasi data, dan kompatibilitas aplikasi. Jalankan lint, typecheck, dan test sebelum commit. Perubahan yang menyentuh environment harus disertai pembaruan template dan dokumentasi.
