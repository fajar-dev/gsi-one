# Developer Guide
## Proyek: GSI One Mobile Application & Express Backend Server

---

## 1. Persiapan Lingkungan Pengembangan (Development Setup)

### 1.1 Persyaratan Sistem
- Node.js v20+ & npm / yarn
- Android Studio & Android SDK (API Level 21+)
- Xcode (khusus macOS untuk pengembangan iOS)
- React Native CLI (v0.83+)
- SQLite3 (untuk database lokal backend)

### 1.2 Langkah Instalasi & Menjalankan Frontend
1. Clone repositori proyek GSI One.
2. Install dependensi frontend:
   ```bash
   npm ci
   ```
3. Buat file `.env` di root proyek:
   ```env
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   APP_ENV=development
   API_BASE_URL_EMULATOR=http://10.0.2.2:3000
   API_BASE_URL_SIMULATOR=http://localhost:3000
   API_BASE_URL_PRODUCTION=https://grahasurvei.com
   ```
4. Jalankan aplikasi pada Emulator / Simulator:
   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # Web
   npm run web
   ```

### 1.3 Langkah Instalasi & Menjalankan Backend Server
1. Masuk ke direktori `backend/`:
   ```bash
   cd backend
   npm ci
   ```
2. Buat file `backend/.env`:
   ```env
   PORT=3000
   JWT_SECRET=rahasia_jwt_secret_gsi_one_2026_super_secure
   SUPABASE_URL=https://your-supabase-url.supabase.co
   SUPABASE_SECRET_KEY=your-service-role-key
   ```
3. Menjalankan server backend Express (otomatis menginisialisasi SQLite `gsi_one.db`):
   ```bash
   npm start
   ```

### 1.4 Pengujian & Validasi Kualitas Kode
```bash
# Jalankan unit test Jest
npm test

# Jalankan coverage test
npm run test:coverage

# Pengecekan tipe data TypeScript
npm run typecheck

# Pengujian kualitas linting
npm run lint
```

---

## 2. Aturan Pengkodingan (Coding Guidelines)

- **Clean Architecture**: Selalu pisahkan UI dari logika data menggunakan Custom Hooks dan Repository Pattern.
- **Strict TypeScript**: Selalu tentukan tipe data pada fungsi dan variabel. Dilarang menggunakan `any`.
- **Zero Emoji Rule**: Seluruh dokumen, respon sistem, dan komentar kode wajib bersih dari penggunaan emoji.
- **Error Handling**: Gunakan `getErrorMessage` dari `src/utils/errorHelpers.ts` untuk menangkap kesalahan secara konsisten.
- **Security Awareness**: Selalu gunakan `helmet()`, validasi CORS origin, dan RLS Supabase saat menambah endpoint atau tabel baru.
