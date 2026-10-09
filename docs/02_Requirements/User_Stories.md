# User Stories Specification
## Proyek: GSI One Mobile Application & Backend Infrastructure

---

## 1. User Stories berdasarkan Peran Pengguna

### 1.1 Peran: Pengunjung Publik / Calon Klien
- **US-PUB-01**: Sebagai calon klien, saya ingin melihat katalog layanan utama PT GSI agar dapat memahami spesifikasi asesmen struktur yang dibutuhkan.
- **US-PUB-02**: Sebagai calon klien, saya ingin mengajukan permohonan survei lokasi (Book Survey) via formulir interaktif agar dapat menjadwalkan inspeksi lapangan secara cepat.

### 1.2 Peran: Client / Klien Terdaftar
- **US-CLI-01**: Sebagai Klien GSI, saya ingin login menggunakan Email dan Password agar dapat mengakses area terlindungi proyek saya.
- **US-CLI-02**: Sebagai Klien GSI, saya ingin memantau persentase progres linimasa 4 tahapan proyek saya secara real-time dari Client Dashboard.
- **US-CLI-03**: Sebagai Klien GSI, saya ingin membaca log harian pekerjaan lapangan (`stage_updates`) dan mengunduh berkas laporan inspeksi PDF resmi.
- **US-CLI-04**: Sebagai Klien GSI, saya ingin menerima notifikasi otomatis ketika ada pembaruan status proyek atau pengunggahan berkas baru.

### 1.3 Peran: Field Engineer (Insinyur Lapangan)
- **US-ENG-01**: Sebagai Field Engineer, saya ingin melihat daftar proyek yang ditugaskan kepada saya di Engineer Dashboard.
- **US-ENG-02**: Sebagai Field Engineer, saya ingin memperbarui status tahapan proyek dan persentase kemajuan fisik di lapangan.
- **US-ENG-03**: Sebagai Field Engineer, saya ingin menambahkan entri catatan progres harian (`stage_updates`) dari lokasi survei.
- **US-ENG-04**: Sebagai Field Engineer, saya ingin mengunggah foto inspeksi dan berkas laporan PDF ke Supabase Storage privat.

### 1.4 Peran: Staf Marketing
- **US-MKT-01**: Sebagai Staf Marketing, saya ingin memantau antrean permohonan survei lokasi yang masuk (`bookings`).
- **US-MKT-02**: Sebagai Staf Marketing, saya ingin mengklaim permohonan survei (`pending` -> `claimed`) agar penanganan pemesan terpantau.
- **US-MKT-03**: Sebagai Staf Marketing, saya ingin memproses persetujuan (`approved`) atau penolakan (`rejected`) permohonan survei.
- **US-MKT-04**: Sebagai Staf Marketing, saya ingin menginisiasi konversi permohonan survei yang disetujui menjadi proyek baru.

### 1.5 Peran: System Administrator (Admin)
- **US-ADM-01**: Sebagai System Administrator, saya ingin mendaftarkan akun baru untuk Klien, Engineer, dan Marketing via modal Admin tanpa membuka pendaftaran mandiri publik.
- **US-ADM-02**: Sebagai System Administrator, saya ingin membuat proyek teknis baru, mengonfigurasi `project_code`, menentukan Klien, Marketing, dan Engineer penanggung jawab.
- **US-ADM-03**: Sebagai System Administrator, saya ingin memastikan keamanan backend dengan audit origin CORS, Helmet headers, dan RLS Supabase.
