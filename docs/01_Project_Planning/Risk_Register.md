# Risk Register
## Proyek: GSI One Mobile Application & Backend Infrastructure

---

## Skala Penilaian

- **Dampak**: 1 (Rendah) - 2 (Sedang) - 3 (Tinggi)
- **Probabilitas**: 1 (Rendah) - 2 (Sedang) - 3 (Tinggi)
- **Risk Score** = Dampak x Probabilitas (1-3: Low, 4-6: Medium, 7-9: High)

---

## Daftar Risiko Teridentifikasi & Ter-Audit

| ID    | Kategori     | Deskripsi Risiko                                       | Dampak | Prob. | Score | Status    | Mitigasi Evaluasi Codebase                                      |
| ----- | ------------ | ------------------------------------------------------ | ------ | ----- | ----- | --------- | --------------------------------------------------------------- |
| R-001 | Teknis       | API backend timeout / kegagalan koneksi DB            | 3      | 2     | 6     | Mitigated | Error handling terpusat di `errorHelpers.ts`, retry logic & fallback lokal |
| R-002 | Keamanan     | Akses CORS dari domain tidak dikenal / unauthorized     | 3      | 2     | 6     | Mitigated | Whitelist terisolasi di `server.js` (`allowedOrigins`), log audit origin |
| R-003 | Keamanan     | Header HTTP rentan terhadap serangan XSS/Clickjacking  | 3      | 1     | 3     | Mitigated | Penggunaan `helmet()` middleware & penyembunyian `x-powered-by` |
| R-004 | Operasional  | `JWT_SECRET` tidak didefinisikan di environment server  | 3      | 1     | 3     | Mitigated | Penghentian fatal server (`process.exit(1)`) jika `JWT_SECRET` belum diset |
| R-005 | Keamanan     | Akses data antar-role bocor di PostgreSQL              | 3      | 1     | 3     | Mitigated | Row Level Security (RLS) aktif pada 7 tabel Supabase            |
| R-006 | Operasional  | Inkonsistensi nama klien pada proyek & profil          | 2      | 2     | 4     | Mitigated | Trigger otomatis `sync_user_name_changes` di PostgreSQL         |
| R-007 | Teknis       | Upload file berukuran besar melampaui batas server      | 2      | 2     | 4     | Mitigated | Batas `express.json({ limit: '10mb' })` & validasi Multer       |
| R-008 | Bisnis       | Lambatnya respons tindak lanjut booking survei         | 2      | 2     | 4     | Mitigated | Fitur klaim status booking (`claimed`) oleh Marketing & Admin   |
