# Version History
## Proyek: GSI One Mobile Application & Backend Infrastructure

---

## Riwayat Versi & Pembaruan Codebase

| Versi | Tanggal Rilis | Tipe Rilis | Ringkasan Perubahan Utama |
| --- | --- | --- | --- |
| **v3.0.0** | 31 Juli 2026 | Major | Audit keamanan CORS & Helmet, pembaruan dokumentasi 12 folder, penambahan tabel ISO 25010 & RBAC, regenerasi HTML Viewer |
| **v2.1.0** | 28 Juli 2026 | Minor | Sinkronisasi dokumentasi SDLC 100%, reorganisasi Clean Architecture 5-layer (skor Maintainability A), pipeline Survey Request lengkap |
| **v2.0.0** | 15 Juni 2026 | Major | Migrasi ke Supabase PostgreSQL RLS, Multi-Role Dashboard (Admin, Marketing, Engineer, Client), Admin-Only Registration |
| **v1.0.0** | 13 Mei 2026 | Major | MVP Alpha - Katalog Layanan, Booking Survei, Tracking Proyek dasar, Autentikasi JWT |

---

## Detail Perubahan per Versi

### v3.0.0 (31 Juli 2026) - Security Audit & Documentation Overhaul

| Kategori | Perubahan |
| --- | --- |
| Keamanan | Audit CORS whitelist enforcement di `server.js` (3 origin terdaftar) |
| Keamanan | Integrasi `helmet()` untuk HTTP security headers |
| Keamanan | Validasi fatal `JWT_SECRET` pada startup backend server |
| Dokumentasi | Pembaruan 12 folder docs dengan tabel RACI, RBAC, RTM, ISO 25010, SLO, Test Cases |
| Dokumentasi | Regenerasi `docs_data.js` dan seluruh file `.html` Viewer |

### v2.1.0 (28 Juli 2026) - SDLC Documentation Sync & Refactoring

| Kategori | Perubahan |
| --- | --- |
| Arsitektur | Reorganisasi ke Clean Architecture 5-layer |
| Repository | Sub-repository facade (Query, Stage, File, Command) |
| Testing | Baseline 15 suite, 74 tests (termasuk integration, pagination, RLS, storage) |
| Pipeline | Alur Survey Request lengkap: klaim, approval, rejection, konversi ke proyek |

### v2.0.0 (15 Juni 2026) - Multi-Role & Supabase RLS Migration

| Kategori | Perubahan |
| --- | --- |
| Database | Migrasi dari SQLite-only ke Supabase PostgreSQL Cloud dengan RLS |
| Auth | Admin-Only Registration via `AdminRegisterModal` |
| Frontend | Multi-Role Dashboard (Admin, Marketing, Engineer, Client) |
| Type Safety | Penambahan `database.types.ts` untuk strict typing Supabase rows |

### v1.0.0 (13 Mei 2026) - MVP Alpha Release

| Kategori | Perubahan |
| --- | --- |
| Frontend | Katalog 6 Layanan, Studi Kasus, Booking Survei |
| Backend | Express REST API, SQLite database lokal |
| Auth | Login JWT dasar dengan email/password |
| Project | Tracking proyek dasar dengan status sederhana |
