# UML: Sequence Diagrams
## Proyek: GSI One Mobile Application & Express Backend API

---

## 1. Sequence Diagram: Alur Autentikasi Login JWT & Rate Limiting

```mermaid
sequenceDiagram
    actor User as Pengguna (User)
    participant Screen as LoginScreen.tsx
    participant Store as authStore (Zustand)
    participant Storage as AsyncStorage
    participant Express as Backend Express Server
    participant Limiter as authLimiter (Rate Limit)
    participant DB as SQLite / Supabase DB

    User->>Screen: Input Email/Nomor Tiket & Password
    Screen->>Store: login(ticketOrEmail, password)
    Store->>Express: POST /api/login { email, password }
    Express->>Limiter: Check Request Rate (< 10 / 15 mins)
    
    alt Rate Limit Terlampaui (> 10 attempts)
        Limiter-->>Express: Block Request
        Express-->>Store: 429 Too Many Requests
        Store-->>Screen: Tampilkan Pesan Terlalu Banyak Percobaan
    else Rate Limit Valid
        Limiter-->>Express: Pass Request
        Express->>DB: Query User & Verify Password Hashing (bcryptjs)
        alt Kredensial Valid
            DB-->>Express: Return User Record
            Express->>Express: Sign JWT Token (JWT_SECRET)
            Express-->>Store: 200 OK { token, user }
            Store->>Storage: setItem('auth_token', token) & ('auth_user', user)
            Store-->>Screen: Redirect ke Dynamic Dashboard per Role
        else Kredensial Salah
            DB-->>Express: User Not Found / Invalid Password
            Express-->>Store: 401 Unauthorized
            Store-->>Screen: Tampilkan Pesan Kredensial Salah
        end
    end
```

---

## 2. Sequence Diagram: Alur Booking Survei & Konversi ke Proyek

```mermaid
sequenceDiagram
    actor Public as Pengunjung Publik
    actor Marketing as Staf Marketing
    participant BookScreen as BookSurveyScreen.tsx
    participant ReqScreen as SurveyRequestsScreen.tsx
    participant Express as Backend Express API
    participant DB as Database (bookings & projects)

    Public->>BookScreen: Isi Form Booking Survei & Kirim
    BookScreen->>Express: POST /api/bookings { full_name, email, phone, location, preferred_date }
    Express->>DB: INSERT INTO bookings (status='pending')
    DB-->>Express: Record ID Created
    Express-->>BookScreen: 201 Created -> Navigate ke SuccessScreen

    Marketing->>ReqScreen: Buka Antrean Permohonan Survei
    ReqScreen->>Express: GET /api/bookings
    Express->>DB: SELECT * FROM bookings WHERE status='pending'
    DB-->>Express: Return List Bookings
    Express-->>ReqScreen: Render List Bookings

    Marketing->>ReqScreen: Tekan Klaim Permohonan
    ReqScreen->>Express: PUT /api/bookings/:id/claim
    Express->>DB: UPDATE bookings SET status='claimed', claimed_by=marketing_name
    DB-->>Express: Success
    Express-->>ReqScreen: Status Updated

    Marketing->>ReqScreen: Setujui & Konversi ke Proyek Baru
    ReqScreen->>Express: PUT /api/bookings/:id/status { status: 'approved' }
    Express->>DB: UPDATE bookings SET status='approved'
    ReqScreen->>Express: POST /api/projects { project_code, name, client_id, start_date }
    Express->>DB: INSERT INTO projects & Generate 4 Default project_stages
    DB-->>Express: Project Created
    Express-->>ReqScreen: Proyek Baru Berhasil Dibuat
```

---

## 3. Sequence Diagram: Pembaruan Stage & Input Log Harian (Field Engineer)

```mermaid
sequenceDiagram
    actor Eng as Field Engineer
    participant Screen as ProjectDetailScreen.tsx
    participant Modal as AddLogModal.tsx
    participant Express as Backend Express API
    participant DB as Database (stage_updates & project_stages)

    Eng->>Screen: Buka Proyek & Pilih Stage
    Eng->>Screen: Update Progress Stage ke 50%
    Screen->>Express: PUT /api/stages/:stageId { status: 'in_progress', progress: 50 }
    Express->>DB: UPDATE project_stages SET progress=50, status='in_progress'
    DB-->>Express: Success
    Express-->>Screen: Progress Updated

    Eng->>Modal: Input Catatan Pekerjaan Lapangan & Submit
    Modal->>Express: POST /api/stages/:stageId/updates { description, progress }
    Express->>DB: INSERT INTO stage_updates (project_id, stage_id, description, progress)
    DB-->>Express: Log Record Created
    Express-->>Screen: Refresh Timeline & Daily Logs
```

---

## 4. Sequence Diagram: Upload Berkas Inspeksi & Signed URL Privat

```mermaid
sequenceDiagram
    actor Eng as Field Engineer
    actor Client as Klien Terdaftar
    participant Modal as UploadFileModal.tsx
    participant Express as Backend Express API
    participant Multer as Multer Middleware
    participant Storage as Supabase Storage Privat

    Eng->>Modal: Pilih Berkas Laporan PDF (< 10MB) & Upload
    Modal->>Express: POST /api/projects/:id/files (multipart/form-data)
    Express->>Multer: Validasi Ukuran (< 10MB) & Mime Type
    Multer->>Storage: Upload File ke Bucket Privat 'projects/'
    Storage-->>Express: File Path / Key
    Express->>Express: INSERT Metadata ke tabel project_files
    Express-->>Modal: 201 Created -> File Berhasil Diunggah

    Client->>Express: GET /api/files/project/:projectId
    Express->>Storage: Request Signed URL (Expires in 3600s)
    Storage-->>Express: Return Signed URL
    Express-->>Client: Return File List dengan Signed Download URL
```
