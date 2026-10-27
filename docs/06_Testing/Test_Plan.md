# Test Plan

## Strategi

1. Jalankan lint, TypeScript, dan Jest pada perubahan aplikasi.
2. Uji UI pada perangkat Android/iOS dan browser sesuai platform yang diubah.
3. Uji Supabase dengan akun admin, marketing, engineer, dan klien pada project pengujian.

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run test:coverage
```

## Prioritas

Auth, pembuatan akun admin, isolasi RLS, dan konsistensi proyek/tahapan memiliki prioritas tertinggi. Lanjutkan dengan booking, upload, realtime, notifikasi, lalu katalog publik.

Jest menguji entitas, helper, pemetaan, filter query, pagination, dan alur service dengan mock. Pengujian izin database harus dilakukan pada Supabase; pengujian upload harus memeriksa konten Storage dan metadata secara terpisah.

## Kelulusan

Catat hasil aktual dan keterbatasannya. Test yang belum tersedia tidak boleh diberi status lulus. Jangan memakai kelulusan test mock sebagai bukti keberhasilan alur pengguna secara menyeluruh. Operasi mutasi menggunakan data uji yang dapat dikenali dan dibersihkan setelah pengujian.
