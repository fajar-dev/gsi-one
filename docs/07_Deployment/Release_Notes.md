# Release Notes
## GSI One - Catatan Rilis Seluruh Versi

---

## Tabel Ringkasan Rilis (Release History)

| Versi | Tanggal Rilis | Tipe | Fitur Utama / Perubahan Kunci |
| --- | --- | --- | --- |
| **v3.0.0** | 31 Juli 2026 | Major | Audit keamanan CORS/Helmet, dokumentasi 12 folder SDLC, tabel ISO 25010 & RBAC |
| **v2.1.0** | 28 Juli 2026 | Minor | SDLC docs sync, Clean Architecture 5-layer, Survey Request Pipeline, 15 test suites |
| **v2.0.0** | 15 Juni 2026 | Major | Supabase PostgreSQL RLS, Multi-Role Dashboard, Admin-Only Registration |
| **v1.0.0** | 13 Mei 2026 | Major | MVP Alpha: Katalog Layanan, Booking Survei, Login JWT, Tracking Proyek dasar |

---

## Detail Release Notes v3.0.0 (31 Juli 2026)

### Fitur Baru & Perubahan

| Kategori | Item Perubahan | File Terdampak |
| --- | --- | --- |
| Keamanan | CORS whitelist enforcement (3 origin resmi) | `backend/server.js` |
| Keamanan | Integrasi `helmet()` HTTP security headers | `backend/server.js` |
| Keamanan | Validasi fatal `JWT_SECRET` pada startup server | `backend/server.js` |
| Keamanan | Penyembunyian `x-powered-by` header | `backend/server.js` |
| Dokumentasi | Tabel RACI Matrix di Communication Plan | `docs/01_Project_Planning/Communication_Plan.md` |
| Dokumentasi | Tabel RBAC Permission Matrix di RTM | `docs/02_Requirements/Requirement_Traceability_Matrix.md` |
| Dokumentasi | Tabel Endpoint API lengkap | `docs/03_Architecture_Design/API_Specification.md` |
| Dokumentasi | Tabel ISO 25010 (8 karakteristik) | `docs/10_Quality_Model/ISO25010_Quality_Assessment.md` |
| Dokumentasi | Tabel SLO Baseline dengan alert threshold CORS | `docs/slo/SLO_BASELINE.md` |
| Dokumentasi | Regenerasi HTML Viewer & `docs_data.js` | `docs/generate_docs.js` |

### Persyaratan Sistem

| Platform | Minimum | Target |
| --- | --- | --- |
| Android | API Level 21 (Android 5.0 Lollipop) | API Level 34 (Android 14) |
| iOS | 13.0 | 17+ |
| Node.js | v20+ | v22 LTS |
| Browser (Web) | Chrome 90+, Firefox 90+, Safari 15+ | Chrome latest |

### Dependensi Utama

| Package | Versi | Fungsi |
| --- | --- | --- |
| `react-native` | 0.83.1 | Framework mobile cross-platform |
| `express` | 4.21.2 | Backend REST API server |
| `@supabase/supabase-js` | 2.110.x | Client SDK Supabase (DB, Auth, Storage) |
| `helmet` | 8.3.0 | HTTP security headers middleware |
| `cors` | 2.8.5 | CORS middleware |
| `express-rate-limit` | 8.5.2 | Rate limiting middleware |
| `jsonwebtoken` | 9.0.2 | JWT token signing & verification |
| `bcryptjs` | 2.4.3 | Password hashing |
| `multer` | 1.4.5-lts.1 | File upload handling |
| `zustand` | 5.0.14 | State management |
| `jest` | 29.6.3 | Testing framework |
| `typescript` | 5.8.3 | Type checking |
