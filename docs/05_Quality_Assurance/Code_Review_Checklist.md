# Code Review Checklist
## Proyek: GSI One Mobile Application & Backend Express API

---

Checklist ini wajib diverifikasi oleh reviewer sebelum menyetujui Pull Request.

---

## A. Keterbacaan & Maintainability

- [ ] Nama variabel, fungsi, dan komponen deskriptif dan mengikuti konvensi (lihat Coding Standard).
- [ ] Tidak ada kode yang dikomentari tanpa penjelasan (`// TODO` tanpa tiket dilarang).
- [ ] Fungsi memiliki single responsibility (tidak melakukan terlalu banyak hal sekaligus).
- [ ] Tidak ada magic number (angka literal tanpa konstanta bernama).

## B. Keamanan & Audit System (CORS, RLS, & Headers)

- [ ] Tidak ada data sensitif (token, password) yang dicetak di `console.log`.
- [ ] Backend Express memverifikasi origin CORS via whitelist resmi (`https://grahasurvei.com`, `http://localhost:3000`, `http://10.0.2.2:3000`).
- [ ] Integrasi `helmet()` aktif untuk proteksi XSS, HSTS, dan Framing.
- [ ] Wajib memeriksa keberadaan `JWT_SECRET` pada startup backend server.
- [ ] Tabel database Supabase baru terlindungi oleh Row Level Security (RLS) policies.
- [ ] Tidak ada API key, secret, URL Supabase, atau JWT secret yang ditulis langsung (hardcode) di source code.
- [ ] File `.env` dan `backend/.env` tidak ikut ter-commit (`.gitignore`).

## C. Performa & Resource Optimization

- [ ] Tidak ada re-render yang tidak perlu (gunakan `useCallback`, `useMemo` bila relevan).
- [ ] Komponen daftar panjang menggunakan `FlatList` dengan pagination `limit`/`offset`.
- [ ] File upload dibatasi maksimum 10MB dengan validasi tipe berkas Multer.

## D. Penanganan Error & Resiliensi

- [ ] Semua pemanggilan `async/await` memiliki blok `try/catch`.
- [ ] State loading (`isLoading`) diatur dengan benar.
- [ ] Pesan error yang ditampilkan ke pengguna bersifat ramah dan menggunakan helper `errorHelpers.ts`.

## E. Pengujian & Automated Testing

- [ ] Logika bisnis baru memiliki unit test Jest yang lulus (`npm test`).
- [ ] Pengecekan tipe data TypeScript bebas error (`npm run typecheck`).
- [ ] Reviewer sudah menguji perubahan secara manual di emulator/device atau Postman API.

## F. Kesesuaian dengan Requirement

- [ ] Perubahan sesuai dengan acceptance criteria yang tercantum di User Story.
- [ ] Aturan Zero Emoji dipatuhi secara ketat pada komentar dan respons UI.
