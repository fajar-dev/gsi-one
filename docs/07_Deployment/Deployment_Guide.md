# Deployment Guide & SDLC Release Strategy
## Proyek: GSI One Mobile Application & Express Backend Infrastructure

---

## 1. Prasyarat & Quality Gates Deployment

Sebelum rilis ke lingkungan produksi (*production environment*), seluruh kriteria *Quality Gates* berikut wajib terpenuhi:

- [x] **TypeScript Strict Check**: `npm run typecheck` menghasilkan **0 Errors**.
- [x] **Automated Testing Suite**: `npm run test:ci` atau `npm test` menghasilkan **0 Failures** (15 Test Suites Passed).
- [x] **Security Audit**: Backend Express terverifikasi mengaktifkan `helmet()`, CORS whitelist origin (`https://grahasurvei.com`), dan validasi startup `JWT_SECRET`.
- [x] **Database RLS Policies**: Seluruh tabel Supabase (`projects`, `bookings`, `project_stages`, `stage_updates`, `project_files`, `notifications`, `users`) telah mengaktifkan Row Level Security (RLS).
- [x] **Keystore & Signing Config**: Keystore rilis Android telah siap dan terkonfigurasi di `android/app/build.gradle`.

---

## 2. Deployment Backend Express REST API

### 2.1 SSH & Direct Setup di Server VPS
```bash
# 1. SSH ke VPS Server
ssh admin@api.grahasurvei.com

# 2. Clone / Pull kode backend terbaru
cd /var/www/gsi-one/backend
git pull origin main

# 3. Install dependensi backend
npm ci --production

# 4. Pastikan file backend/.env sudah diisi:
# PORT=3000
# JWT_SECRET=super_secret_jwt_key
# SUPABASE_URL=https://<your-project>.supabase.co
# SUPABASE_SECRET_KEY=service_role_key

# 5. Jalankan server backend menggunakan PM2
pm2 start server.js --name "gsi-one-backend"
pm2 save
```

---

## 3. Build & Bundle Android Release (APK / AAB)

```bash
# 1. Masuk ke folder android
cd android

# 2. Bersihkan sisa build terdahulu
./gradlew clean

# 3. Build Production AAB (Untuk Google Play Console Track Pengujian Tertutup / Closed Testing)
./gradlew bundleRelease

# 4. Build Production APK (Untuk Instalasi Langsung / Internal HP Testing)
./gradlew assembleRelease
```

**Lokasi Berkas Biner Hasil Build:**
- **Android App Bundle (AAB)**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Android Package (APK)**: `android/app/build/outputs/apk/release/app-release.apk`

---

## 4. Verifikasi Pasca-Deployment (Smoke Test Checklist)

- [ ] **Download & Install**: Aplikasi dapat diinstal dengan lancar dari Google Play / APK.
- [ ] **CORS Verification**: Endpoint REST API menolak origin yang tidak terdaftar dan melayani request domain `https://grahasurvei.com`.
- [ ] **Authentication**: Login dengan akun Client, Marketing, Engineer, dan Admin berhasil.
- [ ] **Realtime Sync & Storage**: Pembaruan status proyek tersinkronisasi dan file tersimpan aman di Supabase Storage privat.
