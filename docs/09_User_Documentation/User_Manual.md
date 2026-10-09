# Panduan Pengguna (User Manual)
## Proyek: GSI One Mobile Application

---

## 1. Pendahuluan

Selamat datang di aplikasi mobile **GSI One** dari PT Graha Survei Indonesia (GSI). Aplikasi ini memberikan kemudahan dalam mengeksplorasi layanan audit struktur, mengajukan survei lokasi, serta memantau progres proyek secara real-time.

---

## 2. Matriks Fitur per Peran Pengguna (Feature-Role Matrix)

| Fitur / Menu | Publik | Client | Engineer | Marketing | Admin |
| --- | --- | --- | --- | --- | --- |
| Katalog 6 Layanan GSI | Ya | Ya | Ya | Ya | Ya |
| Studi Kasus & Pengalaman | Ya | Ya | Ya | Ya | Ya |
| Formulir Book Survey | Ya | Ya | - | Ya | Ya |
| Login / Logout | - | Ya | Ya | Ya | Ya |
| Dashboard Ringkasan | - | Client Dashboard | Engineer Dashboard | Marketing Dashboard | Admin Dashboard |
| Lihat Proyek & Progress | - | Proyek milik sendiri | Proyek ditugaskan | Semua proyek | Semua proyek |
| Update Status Tahapan | - | - | Ya | - | Ya |
| Tambah Log Harian | - | - | Ya | - | Ya |
| Upload Foto / Berkas PDF | - | - | Ya | - | Ya |
| Download Berkas Laporan | - | Ya | Ya | Ya | Ya |
| Klaim Booking Survei | - | - | - | Ya | Ya |
| Approve / Reject Booking | - | - | - | Ya | Ya |
| Konversi Booking ke Proyek | - | - | - | Ya | Ya |
| Buat Akun Pengguna Baru | - | - | - | - | Ya |
| Buat Proyek Baru | - | - | - | - | Ya |
| Hapus Proyek | - | - | - | - | Ya |
| Notifikasi In-App | - | Ya | Ya | Ya | Ya |

---

## 3. Panduan Fitur Pengunjung Publik

### 3.1 Eksplorasi Katalog Layanan
1. Buka aplikasi GSI One.
2. Pilih tab **Layanan Kami** untuk melihat 6 layanan utama (Structural Forensic, Risk Asset Integrity, Repair Design, Natural Hazard Risk, SHMS, EEWS).
3. Ketuk kartu layanan untuk membaca detail penjelasan, risiko, dan manfaatnya.

### 3.2 Mengajukan Survei Lokasi (Book Survey)
1. Pada layar Detail Layanan atau Beranda, tekan tombol **Pesan Survei**.
2. Isi formulir pengajuan: Nama, Perusahaan, Email, Nomor Telepon, Jenis Layanan, Lokasi, Perkiraan Tanggal, dan Catatan.
3. Tekan **Kirim Booking**.
4. Rangkuman pengajuan akan ditampilkan pada layar konfirmasi sukses.

---

## 4. Panduan Fitur Klien Terdaftar (Client)

### 4.1 Login Akun Klien
1. Buka layar **Login**.
2. Masukkan **Nomor Tiket** atau **Email** beserta Kata Sandi yang diberikan oleh Admin GSI.
3. Tekan **Masuk Log**.

### 4.2 Memantau Progres Proyek
1. Masuk ke **Client Dashboard**.
2. Lihat persentase kemajuan fisik proyek Anda.
3. Ketuk proyek untuk membuka **Detail Proyek** dan melihat linimasa 4 tahapan.
4. Baca entri log harian insinyur dan tekan tombol **Unduh PDF** pada berkas laporan.

---

## 5. Panduan Fitur Field Engineer (Insinyur Lapangan)

1. Login ke aplikasi sebagai Engineer.
2. Buka proyek yang ditugaskan kepada Anda pada **Engineer Dashboard**.
3. Di **Project Detail**, perbarui status tahapan dan persentase kemajuan total.
4. Tekan **Tambah Log Harian** untuk memasukkan aktivitas harian di lokasi inspeksi.
5. Tekan **Unggah Berkas** untuk memilih foto inspeksi atau dokumen laporan PDF.

---

## 6. Panduan Fitur Staf Marketing

1. Login ke aplikasi sebagai Marketing.
2. Buka **SurveyRequestsScreen** dari **Marketing Dashboard**.
3. Lihat antrean pengajuan survei publik (`pending`), lalu tekan **Klaim Permohonan**.
4. Setelah berkomunikasi dengan klien, pilih **Setujui** atau **Tolak**.
5. Untuk permohonan yang disetujui, tekan **Konversi ke Proyek** untuk menginisiasi proyek baru.

---

## 7. Matriks Status Alur Booking Survei

| Status Awal | Aksi | Status Akhir | Dilakukan Oleh |
| --- | --- | --- | --- |
| - | Kirim Formulir Booking | `pending` | Publik / Client |
| `pending` | Klaim Permohonan | `claimed` | Marketing / Admin |
| `claimed` | Setujui Permohonan | `approved` | Marketing / Admin |
| `claimed` | Tolak Permohonan | `rejected` | Marketing / Admin |
| `approved` | Konversi ke Proyek | Proyek Baru Dibuat | Marketing / Admin |

---

## 8. Matriks Status Alur Proyek & Tahapan

| Status Proyek | Deskripsi | Transisi Berikutnya |
| --- | --- | --- |
| `pending` | Proyek baru dibuat, menunggu dimulai | `on_progress` |
| `on_progress` | Proyek sedang dikerjakan | `done`, `on_hold` |
| `on_hold` | Proyek ditunda sementara | `on_progress` |
| `done` | Proyek selesai | - |

| Status Stage | Deskripsi |
| --- | --- |
| `pending` | Tahapan belum dimulai |
| `in_progress` | Tahapan sedang dikerjakan |
| `done` | Tahapan selesai |
