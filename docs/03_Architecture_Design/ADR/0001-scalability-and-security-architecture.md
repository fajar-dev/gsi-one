# ADR 0001: Scalability and Security Architecture Enhancements

## Status
Accepted

## Context
Aplikasi GSI One mengalami audit teknis pada 30 Juli 2026 dan diperbarui pada 31 Juli 2026. Audit menemukan perlunya pengetatan Row-Level Security (RLS) notifikasi, penambahan CORS whitelist origin backend, proteksi HTTP security headers (`helmet()`), penanganan fatal env startup check (`JWT_SECRET`), penambahan indeks database relasional, serta pengarsipan dual-DB architecture (SQLite lokal dev & Supabase PostgreSQL cloud prod).

## Decisions

### 1. Strict Owner & Role-based RLS Policies
- Seluruh policy `notifications` diubah menjadi berbasis `user_id = auth.uid()` dan `target_role`.
- Direct client `INSERT` ditutup; notifikasi dibuat via Database Trigger `SECURITY DEFINER` atau Backend REST API terproteksi.
- Seluruh RLS policy proyek (`projects`, `project_stages`, `stage_updates`, `project_files`) dialihkan dari string matching ke UUID `client_id`, `engineer_id`, dan `marketing_id`.

### 2. Backend Security & CORS Whitelist Enforcement
- Backend Express (`server.js`) membatasi origin HTTP request hanya ke domain terdaftar (`https://grahasurvei.com`, `http://localhost:3000`, `http://10.0.2.2:3000`) dengan audit logging callback.
- Integrasi middleware `helmet()` untuk menyertakan `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan HSTS.
- Validasi wajib `JWT_SECRET` pada startup server. Jika tidak ada, server akan keluar dengan error fatal.

### 3. High-Performance Relational Indexing & Pagination
- Penambahan indeks terukur pada `projects(client_id, created_at DESC)`, `projects(marketing_id)`, `projects(engineer_id)`, `projects(status)`, `project_stages(project_id, sequence)`, `stage_updates(stage_id)`, dan `notifications(user_id, created_at DESC)`.
- Penambahan kolom `project_id` pada `stage_updates` dengan trigger otomatis untuk mendukung penyaringan Supabase Realtime per proyek.
- Penerapan `.range(offset, offset + limit - 1)` pada query list proyek dan notifikasi.

### 4. Pure DTO Mapping Layer & Clean Architecture
- Pembuatan `projectMapper.ts` untuk konversi eksplisit dari Supabase Row types ke domain entities tanpa casting `as unknown as`.
- Pemisahan sub-repository facade (`ProjectQueryRepository`, `ProjectStageRepository`, `ProjectFileRepository`, `ProjectCommandRepository`).

## Consequences
- Keamanan data terjamin antar-peran dan antar-klien.
- Performa query database tetap tinggi seiring bertambahnya data proyek.
- backend aman dari serangan cross-origin dan header hijacking.

---

## Tabel Ringkasan Architecture Decision Records (ADR)

| ADR ID | Judul Keputusan | Status | Tanggal | Dampak Utama |
| --- | --- | --- | --- | --- |
| ADR-01 | Gunakan React Native & TypeScript | Accepted | Jan 2026 | Cross-platform Android & iOS, strict type safety |
| ADR-02 | Gunakan Zustand untuk State Management | Accepted | Jan 2026 | Ringan, tanpa boilerplate Redux |
| ADR-03 | Gunakan Supabase BaaS | Accepted | Jan 2026 | PostgreSQL + Auth + Realtime + Storage terintegrasi |
| ADR-04 | Admin-Only Registration (tanpa signup publik) | Accepted | Mar 2026 | Keamanan data proyek terjaga |
| ADR-05 | Centralized Design Tokens & Role Theme | Accepted | Apr 2026 | Konsistensi visual otomatis 4 role |
| ADR-06 | Repository Pattern & Sub-Repository Facade | Accepted | Jun 2026 | Maintainability skor A, DTO mapping terisolasi |
| ADR-07 | Strict RLS Policies berbasis UUID | Accepted | Jul 2026 | Data proyek terisolasi per role/user |
| ADR-08 | CORS Whitelist Enforcement di Express | Accepted | Jul 2026 | Hanya 3 origin terdaftar diizinkan |
| ADR-09 | Helmet HTTP Security Headers | Accepted | Jul 2026 | Proteksi XSS, clickjacking, HSTS |
| ADR-10 | Fatal `JWT_SECRET` Startup Check | Accepted | Jul 2026 | Server tidak bisa jalan tanpa secret |
| ADR-11 | Dual-Database (SQLite Dev & Supabase Prod) | Accepted | Jul 2026 | Isolasi pengujian lokal tanpa cloud dependency |
| ADR-12 | Pagination & Project-Scoped Realtime | Accepted | Jul 2026 | Efisiensi memori pada list besar |

