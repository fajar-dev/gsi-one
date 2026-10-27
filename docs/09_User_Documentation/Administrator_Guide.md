# Panduan Administrator

## Akun pengguna

Login sebagai admin, pilih **Daftar User** pada dashboard, lalu isi nama, email, password minimal 8 karakter, dan role client, marketing, atau engineer. Aplikasi memanggil Edge Function `admin-create-user`, yang memvalidasi sesi admin sebelum membuat akun Auth dan profil `public.users`.

Akun Auth dan akun anggota organisasi Supabase adalah dua hal terpisah. Akses Supabase Dashboard dikelola oleh administrator organisasi, bukan oleh role aplikasi.

## Proyek

Pilih **Proyek Baru**, isi kode, nama, klien terdaftar, marketing, engineer, anggaran, serta tanggal mulai dan estimasi selesai. Tahapan ditambahkan melalui detail proyek. Perubahan nama tampilan tidak menentukan kepemilikan; akses klien memakai UUID `client_id`.

## Database dan operasi

- `supabase/migrations/`: perubahan skema, indeks, policy RLS, trigger, dan bucket.
- `supabase/functions/admin-create-user/`: pembuatan akun tepercaya.
- `supabase/seed.sql`: 4 akun demo, 3 proyek, 10 tahapan, 2 catatan, dan 1 metadata foto. Akun baru memakai `password123`; password akun lama dipertahankan.
- `.env`: hanya konfigurasi client `SUPABASE_URL` dan `SUPABASE_ANON_KEY`.

Terapkan migrasi pada project yang benar melalui prosedur rilis. Jangan memasukkan service-role key ke aplikasi. Periksa policy lewat Supabase Dashboard dan lakukan pengujian tiap peran setelah perubahan.

Reset data adalah operasi terpisah dari seed. Seed tidak menghapus data, dan metadata foto demo tidak menyertakan unggahan fisik ke Storage.
