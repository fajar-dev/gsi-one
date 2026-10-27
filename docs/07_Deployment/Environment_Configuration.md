# Environment Configuration

Aplikasi memakai satu konfigurasi Supabase untuk Android, iOS, dan web. Salin `.env.example` ke `.env` pada root proyek.

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-public-key
```

`src/config/supabase.ts` membaca kedua variabel melalui `@env`. Babel memuat `.env` saat bundling; restart Metro dengan `npm start -- --reset-cache` setelah perubahan. Web memakai konfigurasi Babel pada `webpack.config.js`; `src/platform/web/Environment.ts` menyediakan adapter environment web.

Gunakan project Supabase terpisah untuk development, staging, dan produksi dengan mengganti kedua nilai tersebut. Aplikasi tidak membutuhkan server lokal tambahan.

## Konfigurasi server di Supabase

Edge Function `supabase/functions/admin-create-user/index.ts` memakai `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` dari environment Supabase. Service-role key hanya berada pada lingkungan server, bukan dalam bundle aplikasi.

Origin web diizinkan melalui `ALLOWED_ORIGINS` pada Edge Function: situs resmi dan `http://localhost:8080`, sesuai port Webpack. Aplikasi native memakai sesi Supabase Auth.

## Database dan seed

Migrasi berada di `supabase/migrations/`. `supabase/config.toml` mendaftarkan `supabase/seed.sql` sebagai data demo. Seed dijalankan setelah migrasi; akun baru memakai password demo `password123`, sedangkan password akun lama dipertahankan. Seeder tidak menghapus data dan tidak mengunggah berkas fisik.

Jangan memasukkan service-role key, password database, atau signing key ke Git. `.env` tetap diabaikan oleh Git.
