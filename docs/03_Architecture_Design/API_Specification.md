# API & Repository Specification
## Proyek: GSI One Mobile Application & Express REST Backend API

---

## 1. Konfigurasi Server & Keamanan Endpoint API

### 1.1 Base URL & Environment
- **Development (Android Emulator)**: `http://10.0.2.2:3000/api`
- **Development (iOS/Web Simulator)**: `http://localhost:3000/api`
- **Production**: `https://grahasurvei.com/api`

### 1.2 Keamanan HTTP Headers & CORS Audit
- **CORS Whitelist**: `https://grahasurvei.com`, `http://localhost:3000`, `http://10.0.2.2:3000`. Access Control Allow Credentials diset ke `true`.
- **Security Headers**: `helmet()` mengaktifkan `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan HSTS.
- **X-Powered-By**: Dinonaktifkan (`app.disable('x-powered-by')`).
- **Autentikasi Header**: `Authorization: Bearer <JWT_TOKEN>`.

---

## 2. Daftar Endpoint REST API Backend (`/api`)

### 2.1 Auth Routes (`backend/routes/authRoutes.js`)
- `POST /api/login`: Authenticate user, return JWT token and user profile. Rate-limited (10 attempts / 15 mins).
- `POST /api/register`: Admin-only registration endpoint to create new user accounts (`admin`, `marketing`, `engineer`, `client`).
- `GET /api/me`: Retrieve current logged-in user profile from JWT token.

### 2.2 Project Routes (`backend/routes/projectRoutes.js`)
- `GET /api/projects`: Fetch list of projects accessible by the authenticated user (supports role-based filtering).
- `GET /api/projects/:id`: Fetch detailed project information, stages, updates, and files.
- `POST /api/projects`: Create a new project (Admin only) with auto-generated stages.
- `PUT /api/projects/:id`: Update project metadata (code, name, status, dates, assigned engineer).
- `DELETE /api/projects/:id`: Delete a project and associated records (Admin only).
- `PUT /api/projects/stages/:stageId`: Update project stage status (`pending`, `in_progress`, `done`).
- `POST /api/projects/stages/:stageId/updates`: Add a daily log / progress update (`stage_updates`).

### 2.3 Booking Routes (`backend/routes/bookingRoutes.js`)
- `POST /api/bookings`: Public endpoint for submitting new survey requests.
- `GET /api/bookings`: Retrieve booking requests (Admin & Marketing only).
- `PUT /api/bookings/:id/claim`: Claim a survey request (`pending` -> `claimed`).
- `PUT /api/bookings/:id/status`: Update booking status (`approved` / `rejected`).

### 2.4 File Routes (`backend/routes/fileRoutes.js`)
- `POST /api/files/upload`: Upload inspection photo or PDF document (uses Multer, max 10MB).
- `GET /api/files/project/:projectId`: List files attached to a specific project.
- `GET /uploads/:filename`: Static file streaming with caching header (`maxAge: 7d`, `immutable`).

### 2.5 Notification Routes (`backend/routes/notificationRoutes.js`)
- `GET /api/notifications`: Get user notifications by `user_id` or `target_role`.
- `PUT /api/notifications/:id/read`: Mark a notification as read.
- `POST /api/notifications`: Internal/System endpoint to dispatch notifications.

---

## 3. Kontrak Repository Frontend (TypeScript)

### 3.1 `SupabaseProjectRepository` (Facade Pattern)
- `ProjectQueryRepository`: Memuat kueri proyek dan rincian detail.
- `ProjectStageRepository`: Mengelola pembaruan status stage dan log harian.
- `ProjectFileRepository`: Mengelola unggahan dokumen & penanganan MIME type.
- `ProjectCommandRepository`: Menangani pemrosesan mutasi (create/update/delete).

### 3.2 `SupabaseSurveyRepository`
- `submitSurveyRequest()`: Mengirim formulir booking survei.
- `getSurveyRequests()`: Memuat daftar booking dengan filter status.
- `claimSurveyRequest()`: Mengubah klaim permohonan survei.
- `updateSurveyStatus()`: Memperbarui status persetujuan survei.
