# Project Management Plan
## Proyek: GSI One Mobile Application & Supabase

---

## 1. Milestone Utama Proyek

| No | Milestone                        | Target Tanggal | Status   | Catatan Audit / Scope |
| -- | -------------------------------- | -------------- | -------- | --------------------- |
| 1  | Project Charter Disetujui        | 2026-01-15     | Selesai  | Scope awal & otorisasi tim |
| 2  | Requirements Specification Final | 2026-02-07     | Selesai  | Spesifikasi 4 Role & Alur Bisnis |
| 3  | Architecture Design Disetujui    | 2026-02-28     | Selesai  | PostgreSQL Supabase dan RLS |
| 4  | Supabase dan akses data   | 2026-04-15     | Selesai  | Supabase Auth, RLS, dan Edge Functions |
| 5  | MVP Build Pertama (Alpha)        | 2026-05-09     | Selesai  | React Native Mobile & Web |
| 6  | Internal & Security Audit        | 2026-06-06     | Selesai  | Audit RLS Supabase & CORS Whitelist |
| 7  | UAT & Testing per Role           | 2026-06-30     | Selesai  | Admin, Marketing, Engineer, Client |
| 8  | Production Release v1.0          | 2026-07-13     | Selesai  | Live App & REST API |
| 9  | Phase 2: Offline Sync & Advanced Jobs | 2026-10-31 | Terencana | Peningkatan background sync & offline cache |

---

## 2. Resource Plan & Alokasi Peran

| Peran             | Jumlah | Alokasi | Tanggung Jawab Utama |
| ----------------- | ------ | ------- | --------------------- |
| Project Manager   | 1      | 20%     | Pengawasan milestone, jadwal, dan komunikasi stakeholder |
| Lead Developer    | 1      | 100%    | Arsitektur Supabase, RLS, dan Edge Functions |
| Mobile Developer  | 2      | 100%    | Frontend React Native (Android, iOS, Web) & Zustand Store |
| QA & Security Eng | 1      | 50%     | Audit RLS, Edge Functions, dan pengujian Jest |
| UI/UX Designer    | 1      | 50%     | Design tokens terpusat & sistem warna berbasis role |

---

## 3. Scope & Komponen Teknologi Terintegrasi

1. **Frontend Mobile & Web**:
   - React Native 0.83, TypeScript, `@react-navigation` (Native Stack & Bottom Tabs).
   - Zustand untuk manajemen state global (`authStore`, `projectStore`).
   - Client Supabase SDK & HTTP REST Client (`src/config/supabase.ts`).

2. **Supabase & Sub-Sistem Keamanan**:
   - Supabase Auth, PostgREST/RLS, Storage, Realtime, dan Edge Function `admin-create-user`.

3. **Database PostgreSQL**:
   - PostgreSQL Supabase dengan migrasi pada `supabase/migrations/` dengan 7 tabel utama (`users`, `bookings`, `projects`, `project_stages`, `stage_updates`, `project_files`, `notifications`) yang dilindungi Row Level Security (RLS).

---

## 4. Manajemen Risiko Utama

| Risiko                        | Dampak | Probabilitas | Mitigasi |
| ----------------------------- | ------ | ------------ | -------- |
| Penolakan Request CORS        | Tinggi | Sedang       | Menambahkan whitelist origin resmi dan mekanisme error callback terisolasi |
| Kegagalan Akses File Storage  | Tinggi | Rendah       | Implementasi Signed URL Supabase Storage dengan durasi kadaluarsa aman |
| Sinkronisasi Nama Pengguna    | Sedang | Sedang       | Database Trigger `sync_user_name_changes` pada tabel PostgreSQL |

---

## 5. Proses Manajemen Perubahan (Change Control Process)

Setiap perubahan scope, endpoint API, atau skema database wajib melalui:
1. Pengajuan Change Request (CR) tertulis.
2. Impact Analysis oleh Lead Developer dan QA (memeriksa kompatibilitas RLS & CORS).
3. Evaluasi dan persetujuan Project Manager sebelum deploy ke environment produksi.

---

## 6. Diagram Timeline Milestone (Gantt Chart)

```mermaid
gantt
    dateFormat  YYYY-MM-DD
    title Timeline Pengembangan GSI One Mobile & Supabase

    section Inisiasi & Planning
    Project Charter & Kickoff     :done,    des1, 2026-01-01, 2026-01-15
    Feasibility Study & Cost Plan :done,    des2, 2026-01-16, 2026-01-31

    section Requirement & Architecture
    SRS & 4 Peran Specification   :done,    req1, 2026-02-01, 2026-02-07
    Clean Architecture & Supabase  :done,    arch1, 2026-02-08, 2026-02-28

    section Development
    Supabase SDK & Repository     :done,    dev1, 2026-03-01, 2026-04-15
    React Native Mobile & Web MVP :done,    dev2, 2026-04-16, 2026-05-09

    section Security Audit & QA
    Audit RLS dan Edge Function   :done,    sec1, 2026-05-10, 2026-06-06
    Jest Testing Suite (74 tests) :done,    qa1,  2026-06-07, 2026-06-30

    section Deployment & Phase 2
    Production Release v1.0       :done,    dep1, 2026-07-01, 2026-07-13
    Phase 2 Offline Sync & Jobs   :active,  p2,   2026-07-14, 2026-10-31
```
