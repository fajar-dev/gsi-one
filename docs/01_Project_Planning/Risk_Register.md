# Risk Register
## Proyek: GSI One Mobile Application & Supabase

---

## Skala Penilaian

- **Dampak**: 1 (Rendah) - 2 (Sedang) - 3 (Tinggi)
- **Probabilitas**: 1 (Rendah) - 2 (Sedang) - 3 (Tinggi)
- **Risk Score** = Dampak x Probabilitas (1-3: Low, 4-6: Medium, 7-9: High)

---

## Daftar Risiko Teridentifikasi & Ter-Audit

| ID    | Kategori     | Deskripsi Risiko                                       | Dampak | Prob. | Score | Status    | Mitigasi Evaluasi Codebase                                      |
| ----- | ------------ | ------------------------------------------------------ | ------ | ----- | ----- | --------- | --------------------------------------------------------------- |
| R-001 | Teknis       | Kegagalan koneksi Supabase            | 3      | 2     | 6     | Mitigated | Error handling terpusat di `errorHelpers.ts`, tampilan kegagalan dan pemuatan ulang manual |
| R-005 | Keamanan     | Akses data antar-role bocor di PostgreSQL              | 3      | 1     | 3     | Mitigated | Row Level Security (RLS) aktif pada 7 tabel Supabase            |
| R-006 | Operasional  | Inkonsistensi nama klien pada proyek & profil          | 2      | 2     | 4     | Mitigated | Trigger otomatis `sync_user_name_changes` di PostgreSQL         |
| R-008 | Bisnis       | Lambatnya respons tindak lanjut booking survei         | 2      | 2     | 4     | Mitigated | Fitur klaim status booking (`claimed`) oleh Marketing & Admin   |
