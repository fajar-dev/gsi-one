# Data Flow Diagram (DFD) Specification
## Proyek: GSI One Mobile Application & Express Backend API

---

## 1. DFD Level 0 (Context Diagram)

Diagram konteks memvisualisasikan seluruh masukan data dari entitas luar (Publik, Klien, Engineer, Marketing, Admin) ke dalam Sistem GSI One dan keluaran data yang dihasilkan.

```mermaid
graph TB
    subgraph ExternalEntities["Entitas Luar (External Entities)"]
        Public["Pengunjung Publik"]
        Client["Client Terdaftar"]
        Engineer["Field Engineer"]
        Marketing["Staf Marketing"]
        Admin["System Administrator"]
    end

    subgraph Process0["Sistem Utama GSI One (Process 0)"]
        System0["0. Sistem Informasi GSI One\n(Mobile App & Backend REST API)"]
    end

    Public -->|"Formulir Book Survey"| System0
    System0 -->|"Katalog Layanan & Konfirmasi Booking"| Public

    Client -->|"Kredensial Login & Request PDF"| System0
    System0 -->|"Data Progres Proyek & Signed URL PDF"| Client

    Engineer -->|"Kredensial Login, Update Stage, Log Harian, File"| System0
    System0 -->|"Daftar Proyek Ditugaskan & Notifikasi"| Engineer

    Marketing -->|"Kredensial Login, Klaim, Approval/Rejection"| System0
    System0 -->|"Antrean Booking & Notifikasi Booking Baru"| Marketing

    Admin -->|"Kredensial Login, Data User Baru, Data Proyek Baru"| System0
    System0 -->|"Statistik Sistem Global & Full Access Data"| Admin
```

---

## 2. DFD Level 1 (Process Diagram)

Diagram DFD Level 1 mempecah Sistem GSI One menjadi 4 sub-proses utama dan aliran data ke database (*data store*).

```mermaid
graph TB
    subgraph Entities["Entitas Luar"]
        UserExt["Pengguna (Publik/Client/Eng/Mkt/Admin)"]
    end

    subgraph Processes["Sub-Proses Utama (Process 1.0 - 4.0)"]
        P1["1.0 Autentikasi & Manajemen Akun"]
        P2["2.0 Pengelolaan Booking Survei"]
        P3["3.0 Tracking Proyek & Stages"]
        P4["4.0 Pengelolaan Berkas Lapangan"]
    end

    subgraph DataStores["Penyimpanan Data (Data Stores)"]
        D1[("D1: users")]
        D2[("D2: bookings")]
        D3[("D3: projects")]
        D4[("D4: project_stages")]
        D5[("D5: stage_updates")]
        D6[("D6: project_files")]
        D7[("D7: notifications")]
    end

    UserExt -->|"Form Login / Admin Create User"| P1
    P1 <-->|"Verifikasi Kredensial & Profile Data"| D1
    P1 -->|"Simpan JWT Token Session"| UserExt

    UserExt -->|"Form Booking Survei"| P2
    P2 -->|"INSERT Booking (pending)"| D2
    P2 <-->|"UPDATE Status (claimed/approved/rejected)"| D2
    P2 -->|"Trigger Notifikasi Booking"| D7

    P2 -->|"Konversi Booking ke Proyek"| P3
    UserExt -->|"Create Project / Update Stage Status"| P3
    P3 <-->|"Kueri / UPDATE Proyek"| D3
    P3 <-->|"Auto-Generate & UPDATE 4 Stages"| D4
    P3 -->|"INSERT Progress Update Log"| D5
    P3 -->|"Trigger Notifikasi Progress"| D7

    UserExt -->|"Upload Foto / PDF Laporan"| P4
    P4 -->|"INSERT File Metadata"| D6
    P4 -->|"Generate Signed Download URL"| UserExt
```
