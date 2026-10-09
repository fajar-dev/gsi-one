# Software Quality Assurance Plan (SQAP)
## Proyek: GSI One Mobile Application
## Standar: IEEE 730

---

## 1. Tujuan

Dokumen ini mendefinisikan prosedur, standar, dan aktivitas jaminan kualitas yang diterapkan selama pengembangan GSI One untuk memastikan produk memenuhi persyaratan fungsional, non-fungsional, dan kualitas yang telah ditetapkan.

---

## 2. Ruang Lingkup QA

Aktivitas QA mencakup seluruh tahapan SDLC: dari review requirement, review desain, review kode, pengujian fungsional, hingga verifikasi deployment.

---

## 3. Standar Kualitas yang Berlaku

| Standar         | Cakupan                              |
| --------------- | ------------------------------------ |
| ISO/IEC 25010   | Model kualitas produk perangkat lunak |
| IEEE 730        | Rencana jaminan kualitas perangkat lunak |
| ISO/IEC 29119   | Pengujian perangkat lunak            |
| ESLint Rules    | Standar penulisan kode JavaScript/TypeScript |

---

## 4. Aktivitas QA per Fase

| Fase              | Aktivitas QA                                              | Penanggung Jawab |
| ----------------- | --------------------------------------------------------- | ---------------- |
| Requirements      | Review kelengkapan dan konsistensi SRS                    | PM + Lead Dev    |
| Design            | Review SAD dan SDD terhadap requirement                   | Lead Dev + QA    |
| Development       | Code review per Pull Request, lint check                  | Lead Dev         |
| Testing           | Eksekusi test case, bug reporting, regression testing     | QA Engineer      |
| Deployment        | Smoke test di production environment                      | QA + Dev         |
| Maintenance       | Monitoring, incident reporting                            | QA + Dev         |

---

## 5. Kriteria Kualitas Minimum (Quality Gates)

Sebelum rilis ke production, semua kriteria berikut wajib terpenuhi:

- [ ] Semua test case kritis (priority High) bernilai PASS.
- [ ] Tidak ada bug dengan severity Critical atau High yang masih Open.
- [ ] Code coverage test unit minimal 60% untuk logika bisnis inti.
- [ ] Tidak ada pelanggaran ESLint rule dengan level error.
- [ ] Aplikasi berhasil build di Android dan iOS tanpa error.
- [ ] UAT (User Acceptance Test) telah ditandatangani oleh representative klien.
- [ ] Tidak ditemukan nilai API key, secret, atau password hardcoded di source code (scan dengan grep atau tool serupa).
- [ ] File `.env` dan `backend/.env` terdaftar di `.gitignore` dan tidak ter-commit ke repositori Git.
- [ ] Variabel `JWT_SECRET` di `backend/.env` menggunakan nilai acak yang panjang dan aman (bukan nilai default atau placeholder).

