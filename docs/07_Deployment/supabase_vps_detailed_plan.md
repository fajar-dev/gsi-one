# Rencana Detail Migrasi dan Infrastruktur: Supabase Self-Hosted di VPS

Dokumen ini berisi rencana detail infrastruktur untuk menjalankan Supabase secara mandiri (self-hosted) pada Virtual Private Server (VPS) untuk melayani 40 hingga 80 proyek/klien dengan perkiraan ukuran database 1-2 GB per proyek.

---

## 1. Desain Arsitektur Layanan (Services Detail)

Supabase self-hosted dijalankan menggunakan Docker Compose yang mengemas beberapa layanan mikro yang saling terintegrasi. Berikut adalah detail dari setiap layanan utama yang akan dijalankan:

### A. Kong (API Gateway)
* **Fungsi:** Gerbang masuk utama untuk seluruh request API dari aplikasi React Native. Kong meneruskan request ke layanan yang sesuai berdasarkan path URL (misalnya, `/auth/v1` ke GoTrue, `/rest/v1` ke PostgREST).
* **Konfigurasi Keamanan:** Mengatur limit rate request dan validasi header.

### B. GoTrue (Auth API)
* **Fungsi:** Menangani otentikasi user (login, register, reset password, refresh token).
* **Penyimpanan Kunci:** Menggunakan JWT (JSON Web Token) dengan HS256 secret key.

### C. PostgREST (Auto-REST API)
* **Fungsi:** Mengonversi schema database PostgreSQL secara instan menjadi RESTful API yang aman.
* **Integrasi:** Mematuhi hak akses Row-Level Security (RLS) di database.

### E. Supabase Storage (File Storage)
* **Fungsi:** Mengelola bucket file, gambar, dan dokumen.
* **Storage Backend:** Dapat dikonfigurasi menggunakan penyimpanan lokal VPS atau langsung dihubungkan ke S3-Compatible Object Storage (Cloudflare R2 atau Backblaze B2).

### F. PostgreSQL & pg_graphql (Database Core)
* **Fungsi:** Core database PostgreSQL dengan extension pendukung Supabase.
* **pg_graphql:** Menyediakan endpoint GraphQL otomatis di atas schema Postgres.

### G. Supabase Studio (Dashboard Web)
* **Fungsi:** GUI berbasis web mirip admin panel untuk melihat isi database, mengatur table, dan memantau API logs. Hanya diakses secara internal atau lewat proteksi password/VPN.

---

## 2. Struktur Database (Database Setup)

Untuk menangani 40 - 80 klien (masing-masing 1 - 2 GB), kita menggunakan satu instance PostgreSQL utama dengan pemisahan menggunakan **PostgreSQL Schemas** atau **Multi-Database**.

### Opsi Desain Database:
* **Pilihan Terbaik (Multi-Schema):** 
  * Membuat schema terpisah untuk setiap proyek/klien di dalam satu database utama (misal: `client_01`, `client_02`, dst.).
  * Setiap schema memiliki struktur tabel yang sama tetapi terisolasi satu sama lain.
  * User database khusus dibuat untuk setiap klien agar mereka hanya bisa mengakses schema mereka sendiri.
* **Alasan:** Menjalankan 80 instance PostgreSQL terpisah dalam container Docker membutuhkan minimal 40 GB RAM hanya untuk beban idle PostgreSQL. Dengan multi-schema, beban idle hanya menggunakan satu instance PostgreSQL (~1-2 GB RAM idle).

### Konfigurasi Database:
* **Connection Pooling:** Menggunakan Supavisor (atau PgBouncer) bawaan Supabase untuk mengelola ribuan koneksi konkuren dari aplikasi mobile.
* **Limitasi Memori:** Mengoptimalkan parameter PostgreSQL seperti `shared_buffers` (25% dari total RAM VPS), `work_mem`, dan `effective_cache_size`.

---

## 3. Strategi Penyimpanan & Backup (Storage for Backup)

Kehilangan data klien adalah risiko terbesar dalam self-hosting. Oleh karena itu, setup backup otomatis 3-lapis wajib dikonfigurasi sejak awal.

### A. Lokasi Penyimpanan Backup (Object Storage)
Backup tidak boleh disimpan di VPS yang sama dengan database utama. Kita akan menggunakan Object Storage eksternal yang kompatibel dengan protokol S3:
* **Penyedia Pilihan:** Cloudflare R2 (Tanpa biaya egress/transfer data keluar) atau Backblaze B2 (Sangat murah, ~$6 per TB per bulan).
* **Kebutuhan Storage Backup:** 160 GB (ukuran database maksimal) x 30 salinan harian = ~4.8 TB (estimasi biaya bulanan di Backblaze B2: ~$29).

### B. Mekanisme Backup Otomatis (Cronjob & pg_dump)
1. **Daily Logical Backup (Setiap Malam Jam 02:00):**
   * Script backup otomatis akan menjalankan perintah `pg_dumpall` atau `pg_dump` per schema klien.
   * File dump dikompresi menjadi format `.sql.gz`.
   * Dikirim langsung ke Cloudflare R2 menggunakan CLI Tool `rclone` atau `aws-cli`.
2. **Skema Retensi Backup:**
   * Harian: Disimpan selama 30 hari terakhir.
   * Bulanan: Disimpan selama 12 bulan terakhir.
   * Penghapusan otomatis file backup lama menggunakan Lifecycle Rule di R2/B2.

### C. Backup File Storage
Untuk file media yang diunggah oleh klien ke Supabase Storage, jika file tersebut disimpan secara lokal di VPS, folder `/docker/volumes/supabase_storage` akan di-sync secara harian ke bucket R2/B2 menggunakan perintah `rclone sync`.

---

## 4. Analisis Perbandingan Harga (Pricing Comparison)

Tabel berikut menunjukkan perbandingan harga dan performa deployment antara opsi Cloud Managed Service (Supabase) dengan VPS Self-Hosted (luar dan lokal Indonesia seperti Biznet Gio) untuk skenario 40-80 klien:

| Penyedia & Model Deployment | Spesifikasi Teknis (CPU/RAM/Storage) | 40 Klien (Total ~60 GB DB) | 80 Klien (Total ~120 GB DB) | Kelebihan & Kekurangan |
| :--- | :--- | :--- | :--- | :--- |
| **Supabase Cloud (Multi-Tenant)** | Shared Compute, 8 GB DB limit + Overage $0.125/GB | ~$31.50/bulan (~Rp 510.000) | ~$39.00/bulan (~Rp 630.000) | [Kelebihan] Zero maintenance, uptime tinggi.<br>[Kekurangan] Data klien tergabung dalam satu DB. |
| **VPS Hetzner (Multi-Tenant/Schema)** | 4-8 vCPU, 8-16 GB RAM, 160-240 GB SSD (Dedicated Resource) | ~$22.00/bulan (~Rp 350.000) | ~$40.50/bulan (~Rp 650.000) | [Kelebihan] Sangat murah, performa dedicated, kapasitas disk besar.<br>[Kekurangan] Butuh maintenance & setup backup mandiri. |
| **Biznet Gio NEO Lite (Standard VPS)** | 4-8 vCPU, 8-16 GB RAM, 160-240 GB SSD (Lokal Indonesia) | ~Rp 469.000/bulan (Promo + Vol 100 GB) | ~Rp 1.299.000/bulan (Normal + Vol 150 GB) | [Kelebihan] Latency sangat rendah, bandwidth gratis 10 Gbps, server di Indonesia.<br>[Kekurangan] Butuh setup backup & OS maintenance. |
| **Biznet Gio NEO Lite Pro (High Perf.)** | 4-8 vCPU, 8-16 GB RAM, 180-240 GB NVMe SSD (AMD EPYC) | ~Rp 1.199.000/bulan (Normal + Vol 100 GB) | ~Rp 2.099.000/bulan (Normal + Vol 150 GB) | [Kelebihan] Performa database sangat tinggi (High IOPS NVMe AMD EPYC).<br>[Kekurangan] Harga relatif lebih mahal dibanding VPS luar. |
| **VPS DigitalOcean (Premium SSD)** | 4-8 vCPU, 8-16 GB RAM, 210-320 GB Premium SSD | ~$61.00/bulan (~Rp 980.000) | ~$112.00/bulan (~Rp 1.800.000) | [Kelebihan] Infrastruktur cloud global stabil & mudah digunakan.<br>[Kekurangan] Biaya cukup tinggi untuk database besar. |
| **Supabase Cloud (Single-Tenant)** | Terisolasi penuh (1 proyek/klien), Compute Micro $10/proyek | ~$415.00/bulan (~Rp 6.700.000) | ~$815.00/bulan (~Rp 13.200.000) | [Kelebihan] Isolasi data total antar klien, sangat aman.<br>[Kekurangan] Biaya sangat mahal karena dikalikan jumlah klien. |

### Rekomendasi Utama Pemilihan Infrastruktur:
* **Untuk Kepatuhan Regulasi & Latensi Rendah (Server Lokal):** Menggunakan **Biznet Gio NEO Lite (Standard)** adalah opsi terbaik (~Rp 469.000/bulan) karena data disimpan di Indonesia dan memiliki latensi minimal.
* **Untuk Efisiensi Biaya Terbesar (Global):** Menggunakan **VPS Hetzner** dengan skema multi-tenant memberikan spesifikasi tertinggi dengan harga termurah (~Rp 350.000/bulan).
* **Untuk Tanpa Maintenance Server:** Menggunakan **Supabase Cloud (Multi-Tenant)** dengan pemisahan database menggunakan PostgreSQL schema terpisah (~Rp 510.000/bulan).

---

## 5. Langkah Implementasi (Implementation Steps)

Langkah-langkah berikut akan direncanakan secara matang sebelum eksekusi infrastruktur:

1. **Setup Server VPS:** Install OS Ubuntu LTS terbaru, pasang Docker & Docker Compose.
2. **Konfigurasi Domain & SSL:** Setup Reverse Proxy (Nginx atau Caddy) untuk meneruskan port SSL 443 ke port Kong API Gateway.
3. **Inisialisasi Supabase:** Edit file `.env` Supabase, ubah kunci JWT secret default, atur password DB master yang kuat.
4. **Setup Multi-Tenant Schema:** Buat script SQL untuk otomatisasi pembuatan schema baru dan setup role user PostgreSQL ketika ada klien/proyek baru.
5. **Setup Backup System:** Install rclone, konfigurasi kredensial R2/B2, pasang script backup pada crontab sistem.
6. **Uji Coba Pemulihan (Disaster Recovery Test):** Mencoba memulihkan database dari backup R2 ke server lokal untuk memastikan data backup tidak korup.
