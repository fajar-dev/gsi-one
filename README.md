# GSI One Mobile Application

Aplikasi Mobile Resmi **PT Graha Survei Indonesia (GSI)** untuk pemantauan proyek survei & penilaian forensic struktur bangunan (*Structural Health Monitoring System & Forensic Engineering*).

[![Maintainability Score](https://img.shields.io/badge/Maintainability-Grade%20A-brightgreen)](#-maintainability--kualitas-kodebase)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Mode-blue)](https://www.typescriptlang.org/)
[![CI](https://img.shields.io/badge/CI-Quality%20Gate%20Active-success)](.github/workflows/ci.yml)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20%26%20Layered-orange)](#-dokumentasi-arsitektur--pengembang)

---

## Ikhtisar Aplikasi

**GSI One** dikembangkan menggunakan React Native dan TypeScript dengan arsitektur berlapis (*Clean Architecture, Repository Pattern, & Domain-Driven Design*), Zustand state management, serta integrasi real-time Supabase PostgreSQL. Aplikasi ini mendukung **4 Peran Pengguna (User Roles)** dengan hak akses dan antarmuka khusus:

1. **System Administrator (`admin`)**: Pendaftaran user baru dengan role khusus, pembuatan proyek master, pengaturan tahapan timeline, dan pengawasan operasional sistem.
2. **Marketing & Business Development (`marketing`)**: Pengelolaan reservasi survey ("Daftar Survey"), *claim status* pengajuan calon klien, dan portofolio layanan.
3. **Field Engineer (`engineer`)**: Pembaruan progres harian di lapangan, penambahan catatan log harian, dan pengunggahan hasil pengujian NDT/dokumen teknis.
4. **Client / Klien (`client`)**: Pemantauan real-time progres jembatan/gedung, status tahapan inspeksi visual/sensor, dan pengunduhan laporan.

---

## Maintainability & Kualitas Codebase

Codebase GSI One telah melalui audit maintainability komprehensif dan mencapai **Grade A (Sangat Baik)**:
- **Zero Duplicate Logic**: Seluruh helper error, format tanggal, dan mata uang disentralisasi di `src/utils/errorHelpers.ts` dan `src/utils/formatters.ts`. Logika form pembuatan proyek disentralisasi di `src/screens/Projects/hooks/useCreateProjectForm.ts`.
- **Zero Layer Leaks**: Panggilan Supabase SDK 100% diisolasi dalam Repository Pattern (`SupabaseProjectRepository`, `SupabaseSurveyRepository`) dan Service Facades (`projectService`, `surveyService`).
- **Type-safe Database Schema**: Dilengkapi dengan pemetaan skema database Supabase di `src/types/database.types.ts` tanpa casting `as any`.
- **No Magic Strings**: Penggunaan Enum terpusat (`ProjectStatusEnum`, `ProjectStageStatusEnum`, `UserRoleEnum`).

---

## Teknologi Utama

- **Framework**: React Native 0.83+ (CLI) & TypeScript (*Strict Mode*)
- **Arsitektur**: Clean Architecture, OOP Domain Entities, Repository Pattern, Custom Hooks
- **State Management**: Zustand Stores (`authStore.ts`, `projectStore.ts`)
- **Custom Hooks**: `useCreateProjectForm`, `useProjectDetail`, `useSurveyRequests`, `useEditProjectForm`, `useStructureDetail`, `useProfile`, `useProjectRealtime`
- **Database & Realtime Sync**: Supabase PostgreSQL + Realtime WebSockets + Storage Buckets
- **Operasi admin**: Supabase Edge Function `admin-create-user`
- **Testing & CI**: Jest (unit dan integration test) + GitHub Actions quality gate (`lint`, `typecheck`, `test:ci`)
- **UI & Iconography**: Custom Design System (`assets/styles/Colors.tsx`), React Native Vector Icons (Feather), Linear Gradient, SVG

---

## Struktur Proyek Utama

```
d:\GSI One - Copy\
├── __tests__/               -- Automated Unit Test Suites (Domain, Utils, Service, UI)
├── assets/                  -- Aset gambar, ikon, dan Design Tokens (Colors.tsx)
├── supabase/                -- Migrasi PostgreSQL, Edge Functions, dan seed.sql
├── docs/                    -- Dokumentasi teknis lengkap (SRS, SDLC, Architecture, Deployment)
└── src/
    ├── components/          -- Reusable UI components (ScreenHeader, BottomNav, ErrorBoundary, dll)
    ├── config/              -- Konfigurasi Supabase, API endpoints, dan mocks unit test
    ├── domain/              -- OOP Domain Entities (ProjectEntity, SurveyRequestEntity, UserRole, ProjectStatus)
    ├── hooks/               -- Custom hooks (useAuth, useProjectRealtime, useSurveyRequests, useProjectDetail, useProfile)
    ├── navigation/          -- AuthenticatedTabs & Root Stack Navigation
    ├── screens/
    │   ├── BookSurvey/      -- Form booking survey & SurveyRequestsScreen (Daftar Survey)
    │   ├── Dashboard/       -- Router & modular views per-role (Admin, Marketing, Engineer, Client)
    │   ├── Home/            -- Landing page publik
    │   ├── Login/           -- Authentication screens (Login, Register, ForgotPassword)
    │   ├── Profile/         -- Profil pengguna & pendaftaran akun oleh Admin
    │   ├── Projects/        -- ProjectListScreen, ProjectDetailScreen, CreateProjectScreen, EditProjectModal
    │   ├── Services/        -- LayananKamiScreen (6 Katalog Layanan Resmi GSI), LayananDetailScreen, & ServicesScreen (Our Experience)
    │   └── Structures/      -- Detail struktur & carousel studi kasus (StructureDetail)
    ├── services/            -- Repository Pattern & Services (SupabaseProjectRepository, SupabaseSurveyRepository, projectService, surveyService)
    ├── store/               -- Global Zustand Stores (authStore.ts, projectStore.ts)
    ├── types/               -- TypeScript definitions (database.types.ts, navigation.ts)
    └── utils/               -- Centralized Helpers (errorHelpers, formatters, projectHelpers, userHelpers, responsive)
```

---

## Panduan Pengoperasian & Verifikasi

### 1. Persiapan Environment (.env)
Salin berkas `.env.example` menjadi `.env` pada folder root:
```bash
cp .env.example .env
```

### 2. Menjalankan Aplikasi Mobile (Android)
```bash
npm run android
```

### 3. Pengecekan Kualitas Kode & Tipe Data
```bash
# Verifikasi TypeScript Type Checking
npm run typecheck

# Verifikasi Code Linting (Harus 0 Error)
npm run lint
```

### 4. Menjalankan Unit Test (Jest)
```bash
npm run test:ci
```

---

## Pengujian Otomatis

Suite Jest mencakup unit test serta integration test untuk pemetaan proyek, pagination, matriks filter RLS per peran, lifecycle notifikasi, signed URL storage, dan alur proyek. CI menjalankan `npm ci`, `npm run lint`, `npm run typecheck`, dan `npm run test:ci` pada push/pull request ke `main`, `master`, `dev`, atau `develop`.

---

## Panduan Deployment Singkat

```bash
# 1. Masuk ke folder android
cd android

# 2. Clean build
./gradlew clean

# 3. Build AAB Produksi (Google Play Console)
./gradlew bundleRelease

# 4. Build APK Produksi (Distribusi Direct)
./gradlew assembleRelease
```
Berkas AAB tersimpan di `android/app/build/outputs/bundle/release/app-release.aab`.
Panduan deployment lengkap dari SDLC hingga Play Console rilis dapat dibaca di **[docs/07_Deployment/Deployment_Guide.md](docs/07_Deployment/Deployment_Guide.md)**.

---

## Dokumentasi Arsitektur Lengkap

- **[Panduan Arsitektur & Refactoring Pengembang](docs/04_Development/Developer_Refactoring_Guide.md)**
- **[Arsitektur Sistem & Alur Kerja SDLC](docs/03_Architecture_Design/Architecture_And_SDLC.md)**
- **[Panduan Deployment Produksi](docs/07_Deployment/Deployment_Guide.md)**
- **[Katalog Lengkap API & Database](docs/03_Architecture_Design/API_Catalog_Documentation.md)**
- **[Spesifikasi API REST](docs/03_Architecture_Design/API_SPECIFICATION_Full.md)**
- **[Peta Codebase Proyek](CODEBASE_MAP.md)**
- **[ADR 0001: Skalabilitas & Keamanan](docs/03_Architecture_Design/ADR/0001-scalability-and-security-architecture.md)**
- **[SLO Baseline](docs/05_Quality_Assurance/SLO/SLO_BASELINE.md)**
