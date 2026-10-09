# API & Repository Specification
## Proyek: GSI One Mobile Application
### Versi Dokumentasi: 1.4.0 (Terbaru per 30 Juli 2026)

Dokumen ini mencatat secara menyeluruh kontrak API, repositori, dan layanan data yang berlaku untuk aplikasi GSI One Mobile & Web. Aplikasi menggunakan dua skema komunikasi data utama:
1. **Direct Supabase SDK (Client-side)**: Untuk operasi pembacaan & mutasi yang telah dilindungi oleh **Row Level Security (RLS)** PostgreSQL (`src/services/repositories/`).
2. **Express Modular REST API (Server-side)**: Untuk operasi server-side tepercaya, bypass RLS aman via *Service Role*, upload file multipart, rate limiting, dan audit security (`backend/routes/`).

---

## 1. Kontrak Repository Proyek (`IProjectRepository`)

`IProjectRepository` diimplementasikan secara modular menggunakan **Facade Pattern** oleh `SupabaseProjectRepository` yang mendelegasikan tanggung jawab ke 4 sub-repository aggregate domain di `src/services/repositories/sub/`. Transformasi row database ke entitas aplikasi dilakukan secara eksplisit oleh `src/services/mappers/projectMapper.ts`.

### Sub-Repository Breakdown
- **`ProjectQueryRepository`**: `getProjects`, `getProjectDetail`
- **`ProjectStageRepository`**: `updateStageStatus`, `addStageUpdate`, `createProjectStage`, `updateProjectStage`, `deleteProjectStage`
- **`ProjectFileRepository`**: `uploadFile`, `getMimeType`
- **`ProjectCommandRepository`**: `createProject`, `updateProject`, `deleteProject`, `getUsersByRole`

### Interface Signature

```typescript
getProjects(userId?: string, role?: string, options?: PaginationOptions): Promise<Project[]>
getProjectDetail(projectId: string, role?: string): Promise<ProjectDetail>
updateStageStatus(stageId: string, status: ProjectStageStatus, userId: string): Promise<void>
addStageUpdate(stageId: string, description: string, progress: number, userId: string): Promise<void>
uploadFile(projectId: string, stageId: string | null, fileName: string, fileType: ProjectFileType, userId: string, fileUri?: string): Promise<void>
createProject(project: Omit<Project, 'id' | 'created_at' | 'status'>, userId: string): Promise<void>
createProjectStage(projectId: string, title: string, description: string, userId: string): Promise<void>
updateProject(projectId: string, updates: Partial<Project>): Promise<void>
updateProjectStage(stageId: string, updates: { title: string; description: string }): Promise<void>
deleteProject(projectId: string): Promise<void>
deleteProjectStage(stageId: string): Promise<void>
getUsersByRole(role: string): Promise<UserOptionDto[]>
```

- **Pola Query & Filtering**: Daftar proyek selalu diurutkan berdasarkan `created_at DESC`. Jika `options.limit` diberikan, query menerapkan `.range(offset, offset + limit - 1)`. Filter otorisasi peran menggunakan ID relasional: `client` menyaring `client_id` atau `created_by`, `marketing` menyaring `marketing_id` atau `created_by`, dan `engineer` menyaring `engineer_id` atau `created_by`.

---

## 2. Kontrak Layanan Notifikasi & Storage

### 2.1 Notification Service (`notificationService.ts`)
- `getNotifications(userId?, role?, limit = 20, offset = 0)`: Memuat notifikasi terpaginasi dari database Supabase PostgreSQL.
- `markAsRead(notificationId)` & `deleteNotification(notificationId)`: Melakukan mutasi dengan klausa `.select('id')` untuk memastikan baris yang terdampak valid; `notificationStore` menerapkan *optimistic update* dengan rollback otomatis jika mutasi gagal/ditolak RLS.
- **Pemberitahuan Server-Side**: Pembuatan notifikasi langsung dari klien disegal oleh RLS Policy. Pembuatan notifikasi wajib dilakukan via trigger database `SECURITY DEFINER` atau REST API `POST /api/notifications`.

### 2.2 Storage Service (`storageService.ts`)
- `getSignedUrl(path, expiresInSeconds = 3600, bucket = 'projects')`: Menghasilkan *Signed URL* berbatas waktu untuk mengakses/mengunduh berkas privat dari Supabase Storage Bucket `projects`.

---

## 3. Spesifikasi Express REST API Backend (`backend/routes/`)

Seluruh endpoint backend lokal/produksi dilindungi oleh middleware keamanan terpusat:

### 3.1 Authentication & User Management Routes (`backend/routes/authRoutes.js`)

#### 1. `POST /api/login` & `POST /api/login.php`
- **Tujuan**: Login pengguna lokal JWT.
- **Header**: `Content-Type: application/json`
- **Security**: Rate limited via `authLimiter` (maksimal 10 percobaan/15 menit per IP, localhost dikecualikan).
- **Request Body**:
  ```json
  { "email": "user@example.com", "password": "securepassword123" }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Login berhasil",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
    "user": { "id": "uuid", "email": "user@example.com", "full_name": "Nama User", "role": "client" }
  }
  ```

#### 2. `POST /api/auth/lookup-ticket`
- **Tujuan**: Resolusi nomor tiket Klien menjadi email untuk login tanpa password Klien (Guest Login).
- **Security**: Access Publik. Memiliki fitur **Auto-Repair**: Jika `ticket_number` belum tersimpam di `public.users`, backend otomatis mencari di `auth.users.user_metadata` dan memperbaiki record `public.users`.
- **Request Body**:
  ```json
  { "ticket_number": "GSI-2026-477566" }
  ```
- **Response Success (200 OK)**: `{ "success": true, "email": "client@example.com" }`
- **Response Error (444 Ticket Not Found)**: `{ "success": false, "message": "Nomor Tiket Klien (GSI-2026-477566) tidak ditemukan" }`

#### 3. `POST /api/admin/create-user`
- **Tujuan**: Registrasi akun pengguna baru (`client`, `marketing`, `engineer`) oleh Admin.
- **Security**: Mandatory `Authorization: Bearer <token>` (Admin Role Only).
- **Request Body**:
  ```json
  {
    "name": "Budi Santoso",
    "email": "budi@example.com",
    "password": "password123",
    "role": "client",
    "ticket_number": "GSI-2026-477566"
  }
  ```
- **Response Success (201 Created)**: `{ "success": true, "message": "Pengguna baru berhasil didaftarkan", "user": { ... } }`

#### 4. `GET /api/users/role/:role`
- **Tujuan**: Mengambil daftar pengguna berdasarkan peran (`client`, `marketing`, `engineer`).
- **Security**: Mandatory `Authorization: Bearer <token>`.
- **Response (200 OK)**: `{ "success": true, "users": [ { "id": "uuid", "name": "Budi", "email": "budi@example.com" } ] }`

#### 5. `POST /api/register` & `POST /api/register.php`
- **Tujuan**: Endpoint registrasi publik lama.
- **Response (403 Forbidden)**: `{ "success": false, "message": "Pendaftaran mandiri sementara dinonaktifkan." }`

---

### 3.2 Project Management Routes (`backend/routes/projectRoutes.js`)

| Method | Endpoint | Auth Required | Ringkasan Respons / Fungsi |
| --- | --- | --- | --- |
| `GET` | `/api/dashboard/stats` | JWT Authenticated | `{ success: true, stats: { total, pending, on_progress, done, on_hold } }` |
| `GET` | `/api/projects` | JWT Authenticated | Menampilkan daftar proyek yang difilter berdasarkan peran ID pengguna. |
| `GET` | `/api/projects/:id` | JWT Authenticated | Menampilkan detail proyek. Bidang `budget` & `project_code` dihapus otomatis untuk `role = 'client'`. |
| `PUT` | `/api/stages/:id` | JWT Staff | Memperbarui status tahapan (`pending`, `in_progress`, `done`), menghitung ulang status proyek, dan memicu notifikasi. |
| `PUT` | `/api/stages/:id/details` | JWT Staff | Memperbarui judul dan deskripsi tahapan proyek. |
| `POST` | `/api/stages/:id/updates` | JWT Staff | Menambahkan catatan harian progres pekerjaan (`description`, `progress`). |
| `PUT` | `/api/projects/:id` | JWT Staff | Memperbarui rincian data induk proyek. |
| `DELETE` | `/api/projects/:id` | JWT Staff | Menghapus proyek beserta seluruh tahapannya secara cascade. |
| `DELETE` | `/api/stages/:id` | JWT Staff | Menghapus tahapan linimasa proyek tertentu. |

---

### 3.3 Booking & File Upload Routes (`backend/routes/bookingRoutes.js` & `fileRoutes.js`)

#### 1. `POST /api/booking` & `POST /api/booking.php`
- **Tujuan**: Pengajuan permohonan survei lokasi baru.
- **Security**: Mandatory JWT Token.
- **Request Body**: `{ full_name, company_name?, email, phone, service_type, location, preferred_date, message? }`
- **Response Success (201 Created)**: `{ "success": true, "message": "Booking survey berhasil diajukan" }`

#### 2. `POST /api/projects/:id/files`
- **Tujuan**: Unggah berkas foto/dokumen teknis proyek (Multipart Form-Data).
- **Security**: Staff Only (Admin/Marketing/Engineer). Client yang mencoba mengunggah akan ditolak (403) dan file otomatis dibersihkan dari storage server.
- **Batasan**: Ukuran file maksimum **20 MB**. Ekstensi & MIME Type di-whitelist ketat (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.mp4`).

---

### 3.4 Notification Server Route (`backend/routes/notificationRoutes.js`)

#### 1. `POST /api/notifications`
- **Tujuan**: Pembuatan notifikasi terpercaya melalui server backend.
- **Security**: Mandatory JWT Token. Klien tidak diizinkan melakukan INSERT langsung ke Supabase `notifications` table (RLS Policy menyegel INSERT publik).
- **Request Body**: `{ userId?, targetRole?, title, message, type, referenceId? }`
- **Response Success (201 Created)**: `{ "success": true, "message": "Notifikasi berhasil dibuat" }`

---

## 4. Keamanan Row Level Security (RLS) & Storage

- **Policy Notifications**: Hanya mengizinkan `SELECT`, `UPDATE`, dan `DELETE` jika `user_id = auth.uid()` atau `target_role` sesuai dengan peran pengguna yang terautentikasi. Tidak ada policy `INSERT` publik/klien.
- **Policy Projects & Relasi**: Membaca proyek, stages, updates, dan files berdasarkan UUID relasional (`client_id`, `created_by`, `engineer_id`, `marketing_id`), bukan berbasis pencocokan string nama.
- **Storage Bucket `projects`**: Privat (`public = false`). RLS Storage Objects memastikan hanya pengguna yang memiliki akses ke proyek tersebut yang dapat memperoleh Signed URL.

---

## 5. Ringkasan Status Code HTTP

| Status Code | Arti | Keterangan |
| --- | --- | --- |
| **200 OK** | Permintaan Berhasil | Query data proyek, lookup ticket, update status |
| **201 Created** | Entitas Berhasil Dibuat | Registrasi user baru, upload file, kirim booking, tambah notifikasi |
| **400 Bad Request** | Validasi Input Gagal | Field mandatory kosong, password < 8 karakter, MIME type dilarang |
| **401 Unauthorized** | Tidak Terautentikasi | Header token Bearer kosong atau kedaluwarsa |
| **403 Forbidden** | Akses Ditolak RLS / Role | Klien mencoba upload file, pendaftaran mandiri |
| **404 Not Found** | Resource Tidak Ada | Proyek ID / Stage ID tidak ditemukan |
| **444 Ticket Not Found** | Nomor Tiket Tidak Ada | Nomor tiket login Klien tidak ditemukan |
| **500 Internal Error** | Server Error | Failure database atau Supabase Auth |
