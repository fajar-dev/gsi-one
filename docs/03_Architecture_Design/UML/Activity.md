# UML: Activity Diagrams
## Proyek: GSI One Mobile Application & Supabase

---

## 1. Activity Diagram: Alur Pemesanan Survei & Pipeline Marketing

```mermaid
flowchart TD
    Start([Mulai]) --> A[Pengunjung Buka Layar Book Survey]
    A --> B[Isi Form: Nama, Email, Telepon, Layanan, Lokasi, Tanggal]
    B --> C{Validasi Form Client-Side}
    C -->|Input Tidak Valid| Err1[Tampilkan Alert Field Error]
    Err1 --> B
    C -->|Valid| D[Kirim Request surveyService.createBooking]
    D --> E{Respons Supabase}
    E -->|Error/Timeout| Err2[Tampilkan Alert Network Error]
    Err2 --> B
    E -->|Success 201| F[Tampilkan SuccessScreen & Reset Form]
    F --> G[Data Tersimpan di Database status: pending]
    
    G --> H[Staf Marketing Buka SurveyRequestsScreen]
    H --> I[Pilih Permohonan Survei & Tekan Klaim]
    I --> J[Status Berubah ke: claimed]
    J --> K{Keputusan Evaluasi Staf}
    K -->|Ditolak| L[Input Alasan & Set Status: rejected]
    L --> End1([Selesai - Booking Ditolak])
    K -->|Disetujui| M[Set Status: approved]
    M --> N[Tekan Konversi ke Proyek Baru]
    N --> O[CreateProjectScreen Terbuka dengan Pre-filled Data]
    O --> P[Simpan Proyek & Auto-generate 4 Stages]
    P --> End2([Selesai - Proyek Aktif Terbuat])
```

---

## 2. Activity Diagram: Alur Login Admin-Only Account Creation

```mermaid
flowchart TD
    Start([Mulai]) --> A[Pengguna Buka Aplikasi]
    A --> B{Apakah Session Token Ada di AsyncStorage?}
    B -->|Ya| C[Pulihkan sesi Supabase Auth]
    C -->|Valid| D[Buka Dynamic Dashboard per Role]
    D --> End1([Selesai - Sesi Aktif])
    C -->|Expired/Invalid| E[Hapus Token & Navigasi ke LoginScreen]
    B -->|Tidak| E
    
    E --> F[Pengguna Input Email/Nomor Tiket & Password]
    F --> G[supabase.auth.signInWithPassword]
    G --> H{Respons Login Server}
    H -->|Gagal| Err1[Tampilkan Alert Error]
    Err1 --> F
    H -->|Sukses 200| I[Simpan Token JWT & Profil ke AsyncStorage]
    I --> D

    subgraph AdminAction["Aktivitas Pendaftaran Akun Terpusat (Admin Only)"]
        AdminStart([Admin Login]) --> J[Buka Admin Dashboard]
        J --> K[Tekan Tombol Buat Akun Baru]
        K --> L[Input Nama, Email, Password, & Role Pengguna]
        L --> M[Edge Function admin-create-user]
        M --> N{Validasi Role Admin}
        N -->|Bukan Admin| Err2[Status 403 Forbidden]
        N -->|Admin Valid| O[Akun Dibuat di Auth & Profile Created]
        O --> P[Kredensial Diterbitkan ke User]
    end
```

---

## 3. Activity Diagram: Alur Pembaruan Tahapan & Input Log Lapangan (Engineer)

```mermaid
flowchart TD
    Start([Mulai Engineer]) --> A[Login & Buka Engineer Dashboard]
    A --> B[Pilih Proyek yang Ditugaskan dari ProjectList]
    B --> C[Buka ProjectDetailScreen & Lihat 4 Linimasa Stage]
    C --> D{Pilih Aksi Engineer}
    
    D -->|Update Status Stage| E[Ubah Status Stage: in_progress / done]
    E --> F[Update Persentase Kemajuan Total Proyek]
    F --> G[projectService.updateStageStatus]
    G --> H[Linimasa Progres Terperbarui]
    
    D -->|Tambah Log Harian| I[Buka AddLogModal]
    I --> J[Input Tanggal, Ringkasan Aktivitas Lapangan & Catatan Kendala]
    J --> K[projectService.addStageUpdate]
    K --> L[Entri Catatan Tersimpan di stage_updates]
    
    D -->|Upload Berkas Lapangan| M[Buka UploadFileModal]
    M --> N[Pilih Foto Inspeksi atau File Laporan PDF < 10MB]
    N --> O[Upload Supabase Storage dan INSERT project_files]
    O --> P[File Tersimpan di Storage Privat & Metadata di DB]
    
    H & L & P --> End([Selesai - Update Lapangan Tersimpan])
```
