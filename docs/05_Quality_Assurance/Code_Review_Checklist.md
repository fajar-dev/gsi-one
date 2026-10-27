# Code Review Checklist

## Implementasi

- [ ] Perubahan memenuhi kebutuhan pengguna dan mempertahankan kontrak aplikasi.
- [ ] Logika UI, state, service, dan repository memiliki tanggung jawab jelas.
- [ ] Error Supabase dan hasil mutasi yang tersaring RLS ditangani dengan benar.
- [ ] State loading dan kegagalan tidak menampilkan data pengguna/proyek sebelumnya.

## Supabase

- [ ] Policy RLS dan kontrol UI diperiksa sebagai dua lapisan berbeda.
- [ ] Edge Function memverifikasi sesi dan role sebelum operasi privileged.
- [ ] Origin web yang dibutuhkan tercakup pada Edge Function.
- [ ] Service-role key dan password database tidak masuk bundle atau log.
- [ ] Upload Storage dan metadata database tetap konsisten saat ada kegagalan.
- [ ] Migrasi baru diuji pada skema dan data yang relevan.

## Verifikasi

- [ ] `npm run lint`, `npm run typecheck`, dan `npm run test:ci` lulus.
- [ ] Alur yang berubah diuji pada platform yang relevan.
- [ ] Perubahan dokumentasi dirender ulang dengan `node docs/generate_docs.js`.
- [ ] `.env` dan signing key tetap tidak dilacak Git.
