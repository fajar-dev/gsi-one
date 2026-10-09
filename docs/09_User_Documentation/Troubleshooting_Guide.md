# Troubleshooting Guide
## Proyek: GSI One Mobile Application

---

## Masalah Umum Pengguna

### 1. Tidak bisa login meskipun sudah mendaftar
**Gejala**: Muncul pesan "Email atau password salah" padahal merasa sudah benar.

**Solusi**:
- Pastikan email yang digunakan sama persis dengan yang didaftarkan (huruf kecil/besar sensitif).
- Coba reset password (fitur mendatang) atau hubungi tim GSI.
- Pastikan koneksi internet aktif saat login.

---

### 2. Form booking tidak bisa dikirim
**Gejala**: Tombol "Kirim Booking" ditekan tetapi muncul pesan peringatan.

**Solusi**:
- Periksa apakah semua kolom bertanda (*) sudah terisi.
- Pastikan format email benar (contoh: `nama@email.com`).
- Pastikan nomor telepon hanya berisi angka dan simbol dasar (minimal 6 karakter).
- Pastikan sudah memilih jenis layanan dari dropdown.
- Pastikan sudah memilih tanggal yang diinginkan.

---

### 3. Aplikasi lambat atau loading lama
**Gejala**: Halaman membutuhkan waktu lama untuk tampil.

**Solusi**:
- Periksa koneksi internet (WiFi atau data seluler).
- Coba tutup dan buka kembali aplikasi.
- Jika masalah berlanjut, coba restart perangkat.

---

### 4. Aplikasi crash / menutup sendiri
**Gejala**: Aplikasi menutup tiba-tiba.

**Solusi**:
- Pastikan versi aplikasi sudah yang terbaru (update di Play Store/App Store).
- Hapus cache aplikasi: Pengaturan > Aplikasi > GSI One > Hapus Cache.
- Jika masalah berulang, laporkan ke tim GSI dengan menyertakan:
  - Tipe dan model perangkat.
  - Versi OS Android/iOS.
  - Layar mana yang sedang dibuka saat crash.

---

## Masalah Developer / Setup

### Metro bundler tidak bisa start
```bash
# Reset cache Metro
npm start -- --reset-cache
```

### Build Android gagal dengan error Gradle
```bash
cd android && ./gradlew clean && cd ..
npm run android
```

### Error "Unable to load script" di emulator
- Pastikan Metro sudah berjalan di terminal terpisah.
- Pastikan emulator dan Metro berada di jaringan yang sama.
- Coba shake device dan pilih "Reload".
