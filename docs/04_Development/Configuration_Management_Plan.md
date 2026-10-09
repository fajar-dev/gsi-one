# Configuration Management Plan
## Proyek: GSI One Mobile Application
## Standar: IEEE 828

---

## 1. Tujuan

Mendefinisikan bagaimana konfigurasi, versi, dan perubahan sistem dikelola selama siklus pengembangan GSI One untuk memastikan konsistensi dan keterlacakan.

---

## 2. Item Konfigurasi (Configuration Items)

| ID  | Item Konfigurasi               | Lokasi                                    | Versi Saat Ini |
| --- | ------------------------------ | ----------------------------------------- | -------------- |
| CI-01 | Source Code Aplikasi         | Git Repository (main branch)              | v1.0.0         |
| CI-02 | Konfigurasi API URL           | `src/config/api.ts`                       | v1.0.0         |
| CI-03 | Android Build Config          | `android/app/build.gradle`                | v1.0.0         |
| CI-04 | iOS Build Config              | `ios/gsione.xcodeproj`                    | v1.0.0         |
| CI-05 | Package Dependencies          | `package.json` + `package-lock.json`      | v1.0.0         |
| CI-06 | TypeScript Config             | `tsconfig.json`                           | v1.0.0         |
| CI-07 | ESLint Config                 | `.eslintrc.js`                            | v1.0.0         |
| CI-08 | Dokumentasi Teknis            | `docs/`                                   | v1.0.0         |
| CI-09 | Environment Variables Frontend| `.env` (**tidak di-commit ke Git**)       | v1.0.0         |
| CI-10 | Environment Variables Backend | `backend/.env` (**tidak di-commit ke Git**)| v1.0.0        |
| CI-11 | Template Env Frontend         | `.env.example` (di-commit ke Git)         | v1.0.0         |
| CI-12 | Template Env Backend          | `backend/.env.example` (di-commit ke Git) | v1.0.0         |
| CI-13 | Babel Config (plugin dotenv)  | `babel.config.js`                         | v1.0.0         |
| CI-14 | TypeScript Env Type Decl.     | `src/types/env.d.ts`                      | v1.0.0         |

---

## 3. Manajemen Versi

Proyek menggunakan **Semantic Versioning (SemVer)**:
- `MAJOR.MINOR.PATCH` (contoh: `1.2.3`)
- **MAJOR**: Perubahan yang tidak kompatibel dengan versi sebelumnya (breaking change).
- **MINOR**: Penambahan fitur baru yang kompatibel.
- **PATCH**: Perbaikan bug yang kompatibel.

---

## 4. Prosedur Perubahan Konfigurasi

Setiap perubahan pada item konfigurasi kritis (terutama CI-02 hingga CI-07) harus melalui:
1. Pengajuan Change Request (CR) oleh developer.
2. Review dampak oleh Lead Developer.
3. Persetujuan PM untuk perubahan yang memengaruhi jadwal atau scope.
4. Update pada `Version_History.md` setelah perubahan diterapkan.

Khusus untuk CI-09 dan CI-10 (file `.env`):
- Nilai aktual **tidak boleh** dibagikan melalui Git commit.
- Distribusi nilai dilakukan secara aman melalui password manager tim atau saluran komunikasi terenkripsi.
- Setiap penambahan variabel baru wajib didokumentasikan di CI-11/CI-12 (`.env.example`) dan CI-14 (`env.d.ts` untuk frontend).

---

## 5. Pengelolaan Environment

| Environment | Branch Git | API Base URL                            | Tujuan                     |
| ----------- | ---------- | --------------------------------------- | -------------------------- |
| Development | `feature/*`| `http://10.0.2.2:3000` (Android emulator) | Pengembangan aktif       |
| Development | `feature/*`| `http://localhost:3000` (iOS/Web)       | Pengembangan aktif         |
| Staging     | `develop`  | URL staging (jika ada)                  | Testing integrasi          |
| Production  | `main`     | `https://grahasurvei.com`               | Rilis ke pengguna akhir    |

Perpindahan environment dilakukan dengan mengubah nilai `API_BASE_URL` aktif di `src/config/api.ts` (un-comment baris yang sesuai).

---

## 6. Aturan Keamanan Konfigurasi

- File `.env` dan `backend/.env` **wajib ada** di `.gitignore` dan tidak boleh ter-commit ke repositori Git.
- Tidak boleh ada nilai API key, secret, atau password yang ditulis langsung (hardcode) di source code (`.ts`, `.tsx`, `.js`).
- Backend `server.js` wajib memuat `require('dotenv').config()` di baris pertama sebelum mengakses `process.env`.
- Variabel `JWT_SECRET` di backend **wajib** diisi di file `backend/.env` — server akan gagal start dengan pesan error jika kosong.
- Untuk variabel environment frontend (Supabase, dll.), konfigurasikan di `src/config/supabase.ts` langsung mereferensikan nilai dari `src/config/api.ts` atau `supabase.ts`.
