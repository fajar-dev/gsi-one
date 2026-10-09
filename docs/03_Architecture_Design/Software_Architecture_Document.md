# Software Architecture Document (SAD)
## Proyek: GSI One Mobile Application
## Standar: ISO/IEC/IEEE 42010

---

## 1. Ikhtisar Arsitektur

GSI One menggunakan arsitektur **Clean Architecture & Layered Domain Design** pada sisi klien (frontend) dengan komunikasi dua arah ke backend melalui HTTPS REST API dan Supabase Cloud (PostgreSQL + Realtime WebSocket + Storage + Auth RLS).

---

## 2. Komponen Arsitektur

### 2.1 Lapisan Presentasi (Presentation Layer)
- **Teknologi**: React Native 0.83, TypeScript (Strict Mode)
- **Komponen**: Layar (`screens/`), komponen UI reusable (`components/`)
- **Header Shared**: `ScreenHeader.tsx` (Gradient otomatis berbasis role via `useRoleTheme`)
- **Navigasi**: React Navigation (Native Stack + Authenticated Bottom Tabs)
- **Styling System**: `assets/styles/Colors.tsx` (Design tokens terpusat), `assets/styles/GlobalStyle.tsx` (`Gs` utility & corner radius asimetris), `src/utils/responsive.ts` (scaling 390px basis)

### 2.2 Lapisan State Management & Hooks
- **Teknologi**: Zustand 5.x
- **Store**: `authStore.ts` (state autentikasi global & pendaftaran user oleh Admin via `AdminRegisterModal`), `projectStore.ts` (state manajemen proyek & tahapan)
- **Custom Hooks**: `useRoleTheme.ts`, `useProjectDetail.ts`, `useSurveyRequests.ts`, `useCreateProjectForm.ts`, `useProjects.ts`, `useDashboardData.ts`

### 2.3 Lapisan Persistensi Lokal
- **Teknologi**: `@react-native-async-storage/async-storage`
- **Data Tersimpan**: `auth_user` (JSON profil pengguna), `auth_token` (JWT / Session token string)

### 2.4 Lapisan Layanan & Repositori (Service & Repository Layer)
- **Pattern**: Repository Pattern (`IProjectRepository` dan `SupabaseSurveyRepository`)
- **Implementasi**: `SupabaseProjectRepository.ts` sebagai façade sub-repository dan `SupabaseSurveyRepository.ts`
- **Service Facade**: `projectService.ts`, `surveyService.ts`, `authService.ts`
- **Project modularization**: `SupabaseProjectRepository` adalah façade dengan `ProjectQueryRepository`, `ProjectStageRepository`, `ProjectFileRepository`, dan `ProjectCommandRepository`; `projectMapper.ts` menjadi batas DTO database.
- **Cross-cutting services**: `notificationService.ts` menjalankan pagination dan mutasi sadar-RLS; `storageService.ts` menerbitkan signed URL untuk bucket privat; `logger.ts` membentuk log terstruktur di development.

### 2.5 Backend & Database Layer
- **Database Production**: Supabase PostgreSQL (dengan Row Level Security / RLS terintegrasi per role)
- **Storage**: Bucket Supabase Storage (`projects/`) untuk dokumen & foto inspeksi proyek
- **Realtime**: Supabase WebSocket Subscription untuk perubahan progres live
- **Schema Type Safety**: `src/types/database.types.ts`
- **Migrasi**: `supabase/migrations/` adalah sumber perubahan skema/policy. Ia mencakup RLS berbasis UUID, indeks relasional, `stage_updates.project_id`, retention notifikasi, dan policy Storage.

---

## 3. Alur Kerja Aplikasi (Application Flow Architecture)

### 3.1 Alur Pengajuan Survei hingga Proyek (Survey-to-Project Flow)
1. Tamu/Pengguna publik mengisi formulir booking survei di `BookSurveyScreen`.
2. Data dikirim ke tabel `bookings` (status `pending`).
3. Staf Marketing/Admin melihat daftar pengajuan di `SurveyRequestsScreen`, lalu mengklaim (`claimed`) permohonan tersebut.
4. Staf memberikan persetujuan (`approved`) atau penolakan (`rejected`).
5. Permohonan berstatus `approved` dikonversi menjadi proyek baru melalui `CreateProjectScreen` dengan pengisian otomatis.
6. Proyek baru dibuat beserta 4 tahapan standar (Inisiasi, Survei Lapangan, Analisis & Laporan, Selesai).

### 3.2 Alur Pembaruan Lapangan & Laporan (Field Update & Report Flow)
1. Field Engineer membuka `ProjectDetailScreen` pada proyek yang ditugaskan.
2. Engineer memperbarui status tahapan dan persentase progres total.
3. Engineer menambahkan catatan pekerjaan/progres ke `stage_updates`.
4. Engineer mengunggah foto inspeksi dan berkas laporan PDF ke bucket Supabase Storage `projects` (metadata `project_files`).
5. Klien memantau perubahan progres secara real-time pada `ClientDashboard` dan mengunduh berkas laporan.

---

## 4. Keputusan Arsitektur (Architecture Decision Records)

| ID     | Keputusan                                    | Alasan                                                                                                  |
| ------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| ADR-01 | Gunakan React Native & TypeScript            | Cross-platform Android & iOS dari satu codebase TypeScript strict mode.                                |
| ADR-02 | Gunakan Zustand                              | State management ringan tanpa boilerplate Redux.                                                       |
| ADR-03 | Gunakan Supabase BaaS                        | Platform terintegrasi untuk PostgreSQL, Storage, WebSocket Realtime, dan Auth RLS.                    |
| ADR-04 | Pendaftaran Akun Terpusat oleh Admin         | Menghapus registrasi mandiri publik demi keamanan data proyek. Akun Klien dibuatkan oleh Admin via modal. |
| ADR-05 | Centralize Design Tokens & Role Theme System | `Colors.tsx` dan `useRoleTheme()` memastikan konsistensi visual otomatis lintas 4 role pengguna.        |
| ADR-06 | Repository Pattern                           | Memisahkan kueri Supabase DB dari UI & Hook layer demi maintainability skor A.                          |
| ADR-07 | Shared Error Helpers & Formatters            | Menggabungkan pengolahan error dan formatting ke `errorHelpers.ts`, `formatters.ts`, `statusMapper.ts`.   |
| ADR-08 | Trusted notification creation & private storage | Insert notifikasi dilakukan trigger/backend; bucket proyek privat diakses dengan signed URL agar RLS dan akses file konsisten. |
| ADR-09 | Pagination & project-scoped realtime | List besar dibatasi `limit`/`offset`; trigger mengisi `stage_updates.project_id` agar channel realtime hanya menerima event proyek terkait. |
