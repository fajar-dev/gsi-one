# Panduan Arsitektur & Refactoring GSI One Mobile

Dokumen ini disusun khusus bagi programmer dan tim pengembang GSI One Mobile untuk memahami struktur arsitektur baru, alur logika aplikasi (*Application Flow*), prinsip desain Clean Architecture & OOP, sentralisasi helpers, serta panduan pengujian dan pengembangan fitur baru.

---

## 1. Latar Belakang & Hasil Refactoring Maintainability

Sebelumnya, beberapa komponen UI dan service layer menampung kode raksasa (*god-component*), menduplikasi fungsi utilitas (`getErrorMessage`, `formatDate`), serta mengakses Supabase SDK secara langsung di layer tampilan.

Melalui refactoring menyeluruh, codebase GSI One kini mencapai **Skor Maintainability A (Sangat Baik)**:
1. **Meningkatkan Maintainability**: Memecah file raksasa menjadi modul-modul kecil (< 250 baris per file).
2. **Pemisahan UI dan Logika (Decoupling)**: Mengisolasi seluruh state management, data fetching, dan bisnis logika ke dalam **Custom Hooks** (`useCreateProjectForm`, `useProjectDetail`, `useSurveyRequests`, `useProjects`, `useDashboardData`).
3. **Penerapan OOP & Domain-Driven Design**: Merangkum aturan bisnis ke dalam **Kelas Entitas Domain** (`ProjectEntity`, `SurveyRequestEntity`) dan mengeliminasi *magic string* menggunakan **Value Objects / Enums** (`ProjectStatusEnum`, `ProjectStageStatusEnum`, `UserRoleEnum`, `SurveyStatusEnum`).
4. **Repository Pattern & Database Type Safety**: Memisahkan layer akses data dari layer aplikasi dengan `IProjectRepository`, `SupabaseSurveyRepository`, dan mapper DTO terpusat di `src/types/database.types.ts`/`projectMapper.ts`.
5. **Sentralisasi Helpers & Error Handling**: Menggabungkan seluruh helper terduplikasi ke `src/utils/errorHelpers.ts`, `src/utils/formatters.ts`, dan `src/utils/statusMapper.ts`.
6. **Automated Testing Suite**: Baseline 30 Juli 2026 menyediakan 15 suite dengan **74 test lulus** menggunakan Jest, termasuk integration/security test.

---

## 2. Struktur Folder Kode Terpusat (`src/`)

```
src/
├── assets/             # Images, fonts, & styles (Colors.tsx, GlobalStyle.tsx)
├── components/         # Reusable presentation UI components (ScreenHeader, StatusBadge)
├── domain/             # Business Logic Pure Domain Layer
│   ├── entities/       # OOP Entities (ProjectEntity, SurveyRequestEntity, UserEntity)
│   └── enums/          # Domain Enums (UserRoleEnum, ProjectStatusEnum)
├── hooks/              # Custom React Hooks (useProjectDetail, useSurveyRequests)
├── navigation/         # React Navigation (AuthenticatedTabs, RootStack)
├── screens/            # Application Screens & Role Dashboards
│   ├── BookSurvey/     # BookSurvey & SurveyRequestsScreen
│   ├── Dashboard/      # Dynamic Role Dashboards (Admin, Mkt, Engineer, Client)
│   ├── Projects/       # ProjectList, ProjectDetail, CreateProject
│   ├── Services/       # LayananKami, LayananDetail, Our Experience
│   └── Profile/        # Profile & Account Management
├── services/           # Repositories & Service Facades
│   ├── repositories/   # Interfaces & Supabase Repositories Implementation
│   └── projectService.ts, surveyService.ts, authService.ts
├── store/              # Zustand Global Stores (authStore.ts, projectStore.ts)
├── types/              # TypeScript Type Definitions & database.types.ts
└── utils/              # Centralized Utility Helpers (errorHelpers, formatters, responsive)
```

---

## 3. Alur Kerja Pengendalian Komponen (Flow Execution Architecture)

1. **Komponen UI Visual (`screens/` & `components/`)**:
   Hanya bertanggung jawab merender elemen tampilan dan menangani event gesture pengguna.
2. **Custom Hook Layer (`hooks/`)**:
   Menangani pengelolaan state lokal, async side-effects, validasi form, dan memanggil Service Facade.
3. **Service & Repository Layer (`services/`)**:
   Mengeksekusi metode repositori (`IProjectRepository`, `ISurveyRepository`) yang melakukan query aman ke Supabase PostgreSQL database.
4. **Domain Entity Layer (`domain/`)**:
   Mengonversi mentah data dari database menjadi objek entitas OOP yang tervalidasi aturan bisnisnya.

---

## 4. Panduan Menambah Fitur Baru

Saat menambah fitur atau modul baru di GSI One Mobile, ikuti langkah wajib berikut:
1. **Definisikan Tipe Data**: Tambahkan tipe skema database di `src/types/database.types.ts` dan tipe domain di `src/types/`.
2. **Buat Entitas Domain / Enum**: Jika memerlukan logika bisnis khusus, buat kelas entitas di `src/domain/entities/`.
3. **Tambahkan Kontrak Repositori**: Buat interface di `src/services/repositories/` dan implementasikan query Supabase pada repositori terkait.
4. **Buat Custom Hook**: Isolasi seluruh pemanggilan data di `src/hooks/`.
5. **Buat Komponen UI**: Susun tampilan visual di `src/screens/` tanpa menyertakan kueri database langsung.
6. **Tulis Unit Test**: Buat pengujian otomatis menggunakan Jest di folder `__tests__/`.
