# Test Cases Specification
## Proyek: GSI One Mobile Application & Express REST API
## Engine Pengujian: Jest, React Native Testing Library, & Supertest / Postman

---

## 1. Ikhtisar Suite Pengujian Automated (Jest)

Pengujian otomatis GSI One Mobile mencakup **15 Test Suites** dengan status **PASSED**, termasuk pagination, RLS security matrix, storage signed URL, backend API endpoints, dan alur integrasi:

| Test Suite File | Komponen / Modul yang Diuji | Status |
| --- | --- | --- |
| `authRepository.test.ts` | Autentikasi Supabase, Login Tiket/Email, Admin User Creation | PASSED |
| `projectEntity.test.ts` | Entitas OOP ProjectEntity, Invarian Aturan Bisnis Proyek | PASSED |
| `surveyRequest.test.ts` | Permohonan Survei, Validasi Form, Status Pipeline | PASSED |
| `errorHelpers.test.ts` | Helper Penanganan Error Terpusat & Parsing Pesan Error | PASSED |
| `formatters.test.ts` | Formatting Tanggal, Mata Uang, Kode Proyek, Nomor Tiket | PASSED |
| `statusMapper.test.ts` | Pemetaan Warna Badge Status Proyek & Tahapan | PASSED |
| `useProjectDetail.test.ts` | Custom Hook Manage State Proyek, Log Harian, Berkas | PASSED |
| `useSurveyRequests.test.ts` | Custom Hook Manage Antrean Survei, Klaim, & Approval | PASSED |
| `notificationService.test.ts` | Pengiriman & Pengubahan Status Dibaca Notifikasi | PASSED |

---

## 2. Skenario Test Cases Kunci

### 2.1 Modul Autentikasi & Keamanan Backend (TC-AUTH & TC-SEC)
- **TC-AUTH-001**: Login berhasil menggunakan Email dan Kata Sandi valid. (EXPECT: Return JWT Token & User Profile).
- **TC-AUTH-002**: Pengguna non-admin mencoba membuat akun baru via `/api/register`. (EXPECT: Status 403 Forbidden).
- **TC-SEC-001 (CORS Audit)**: HTTP Request dari origin tidak dikenal (misal `http://malicious-site.com`). (EXPECT: Connection Error / CORS Origin Blocked & Console Warning `[CORS SECURITY AUDIT]`).
- **TC-SEC-002 (Security Headers)**: Verifikasi HTTP Response Headers. (EXPECT: Header `X-Content-Type-Options: nosniff` dan `X-Frame-Options: SAMEORIGIN` terpasang via `helmet()`).
- **TC-SEC-003 (Fatal Env Validation)**: Menjalankan `server.js` tanpa `JWT_SECRET`. (EXPECT: Server exit dengan status code 1).

### 2.2 Modul Book Survey & Pipeline (TC-SURVEY)
- **TC-SURVEY-001**: Pengajuan survei lokasi dengan data valid. (EXPECT: Record tersimpan di `bookings` status `pending`).
- **TC-SURVEY-002**: Staf Marketing mengklaim permohonan survei. (EXPECT: Status berubah ke `claimed` dan `claimed_by` terisi).
- **TC-SURVEY-003**: Staf menyetujui permohonan survei. (EXPECT: Status berubah ke `approved` dan dapat dikonversi ke proyek).

### 2.3 Modul Project Tracking & Files (TC-PROJ & TC-FILE)
- **TC-PROJ-001**: Pembuatan proyek baru beserta 4 tahapan linimasa default. (EXPECT: Stages default otomatis dibuat).
- **TC-PROJ-002**: Field Engineer memperbarui progres tahapan ke 50%. (EXPECT: Total progress bar proyek terhitung proporsional).
- **TC-FILE-001**: Upload foto inspeksi atau laporan PDF < 10MB via `/api/files/upload`. (EXPECT: File tersimpan di `uploads/` atau Supabase Storage privat dan metadata terdaftar di DB).
