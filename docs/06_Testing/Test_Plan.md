# Test Plan Document
## Proyek: GSI One Mobile Application & Express REST API

---

## 1. Strategi Pengujian (Testing Strategy)

Pengujian perangkat lunak GSI One Mobile dilakukan dalam tiga tingkatan utama:
1. **Automated Unit & Integration Testing (Jest)**: Pengujian unit otomatis untuk memverifikasi entitas domain, repositori data, helper terpusat, dan custom hooks.
2. **Static Code Analysis (TypeScript Strict Check)**: Pengecekan tipe data menggunakan `npx tsc --noEmit` dengan target 0 error.
3. **Manual Verification & UI Testing**: Pengujian antarmuka visual pada emulator Android (Pixel 9) dan perangkat iOS.

---

## 2. Matriks Prioritas Pengujian (Risk-Based Testing Priority)

| Prioritas | Modul / Fitur | Dampak Bisnis | Kompleksitas Teknis | Jenis Pengujian |
| --- | --- | --- | --- | --- |
| P1 - Kritis | Autentikasi & Login JWT | Sangat Tinggi | Tinggi | Unit + Integration + Manual |
| P1 - Kritis | CORS Origin Whitelist | Sangat Tinggi | Sedang | Integration + Manual |
| P1 - Kritis | RLS Policies Database | Sangat Tinggi | Tinggi | Integration (rlsMatrix.test.ts) |
| P2 - Tinggi | Pengajuan Booking Survei | Tinggi | Sedang | Unit + Manual |
| P2 - Tinggi | Klaim & Approval Survei | Tinggi | Sedang | Unit + Manual |
| P2 - Tinggi | Pembuatan Proyek & 4 Stages | Tinggi | Tinggi | Unit + Integration |
| P3 - Sedang | Update Progress Tahapan | Sedang | Sedang | Unit + Manual |
| P3 - Sedang | Upload Berkas Inspeksi | Sedang | Tinggi | Unit (storageService.test.ts) + Manual |
| P3 - Sedang | Notifikasi In-App | Sedang | Sedang | Unit + Manual |
| P4 - Rendah | Katalog Layanan & Studi Kasus | Rendah | Rendah | Manual |
| P4 - Rendah | Dashboard Multi-Role | Rendah | Sedang | Manual |

---

## 3. Matriks Alat Pengujian (Testing Tools Matrix)

| Jenis Pengujian | Alat / Framework | Perintah Eksekusi | Target |
| --- | --- | --- | --- |
| Unit Testing | Jest + React Native Testing Library | `npm test` | Logika bisnis, helpers, entities |
| Integration Testing | Jest + Supabase Mock | `npm run test:ci` | Alur repository, pagination, RLS |
| Type Checking | TypeScript Compiler (TSC) | `npm run typecheck` | 0 errors strict mode |
| Linting | ESLint | `npm run lint` | 0 errors, < 10 warnings |
| Coverage Report | Jest Coverage | `npm run test:coverage` | >= 60% logika bisnis inti |
| Manual UI Testing | Android Emulator / iOS Simulator | `npm run android` / `npm run ios` | Alur visual end-to-end |
| API Testing | Postman / cURL | Manual | Endpoint Express REST API |
| Security Testing | Manual grep + Helmet audit | Manual | Hardcoded secrets, headers |

---

## 4. Kriteria Kelulusan (Pass / Fail Criteria)

| Kriteria | Target | Status |
| --- | --- | --- |
| Seluruh test Jest lulus | 100% Passed | Terpenuhi (15 suites, 74 tests) |
| TypeScript Compilation Errors | 0 Errors | Terpenuhi |
| ESLint Errors | 0 Errors | Terpenuhi |
| Crash / Unhandled Exception pada alur utama | 0 | Terpenuhi |
| Hardcoded API key / secret di source code | 0 | Terpenuhi |
| CORS menolak origin tidak terdaftar | Ya | Terpenuhi |
| `JWT_SECRET` wajib ada di env | Ya (fatal exit) | Terpenuhi |
