# Maintenance Guide
## Proyek: GSI One Mobile Application

---

## 1. Jadwal Pemeliharaan Rutin

| Aktivitas                           | Frekuensi     | Penanggung Jawab |
| ----------------------------------- | ------------- | ---------------- |
| Review dependency updates           | Bulanan       | Lead Developer   |
| Backup database production          | Mingguan      | Admin Server     |
| Review crash reports (play console) | Mingguan      | QA Engineer      |
| Performance profiling               | Per quarter   | Developer        |
| Security audit                      | Per semester  | Lead Developer   |
| Review & update dokumentasi         | Per rilis     | PM               |

---

## 2. Cara Memperbarui Dependensi

```bash
# Cek dependensi yang usang
npm outdated

# Update satu dependensi minor/patch (aman)
npm update <package-name>

# Update dependensi major (hati-hati, baca changelog terlebih dahulu)
npm install <package-name>@latest
```

Setelah update:
1. Jalankan `npm run lint` - pastikan tidak ada error baru.
2. Jalankan `npm test` - pastikan semua test masih lulus.
3. Uji manual di emulator Android dan iOS Simulator.

---

## 3. Memperbarui Data Katalog Layanan

Data studi kasus dan detail struktur tersimpan di `src/data/structures.ts`. Untuk menambahkan atau mengubah data:
1. Edit file `structures.ts` langsung.
2. Pastikan format data konsisten dengan interface `Structure` yang terdefinisi.
3. Uji tampilan di layar `StructureDetail`.
4. Buat PR dan merge ke `develop`.

---

## 4. Monitoring Produksi

- **Google Play Console**: Monitor crash rate, ANR, dan rating pengguna.
- **App Store Connect**: Monitor crash log dan ulasan pengguna.
- Jika crash rate meningkat > 1%, segera investigasi dan terapkan hotfix.

---

## 5. Checklist Pemeliharaan Keamanan Backend

| Item Audit | Frekuensi | Penanggung Jawab | Cara Verifikasi |
| --- | --- | --- | --- |
| Verifikasi CORS whitelist masih sesuai | Per rilis | Lead Developer | Cek `allowedOrigins` di `server.js` |
| Verifikasi `helmet()` aktif | Per rilis | Lead Developer | Cek HTTP response headers |
| Rotasi `JWT_SECRET` | Per semester | Admin Server | Generate key baru via `crypto.randomBytes(64)` |
| Verifikasi RLS aktif di semua tabel Supabase | Per rilis | Lead Developer | Jalankan `backend/verify_rls.sql` |
| Audit hardcoded secrets di source code | Per rilis | QA Engineer | Grep untuk pattern API key / secret |
| Verifikasi `.env` tidak ter-commit | Per PR | Code Reviewer | Cek `.gitignore` dan git status |
| Review log audit CORS ditolak | Mingguan | Admin Server | Cek server console untuk `[CORS SECURITY AUDIT]` |
| Verifikasi rate limiter login berfungsi | Per rilis | QA Engineer | Test dengan > 10 login gagal berturut |

---

## 6. Tabel Dependensi Utama & Jadwal Update

| Package | Versi Saat Ini | Tipe | Jadwal Review | Risiko Update |
| --- | --- | --- | --- | --- |
| `react-native` | 0.83.1 | Frontend Framework | Per quarter | Tinggi (breaking changes) |
| `express` | 4.21.2 | Backend Framework | Bulanan | Rendah (minor/patch) |
| `@supabase/supabase-js` | 2.110.x | Database SDK | Bulanan | Sedang |
| `helmet` | 8.3.0 | Security Middleware | Bulanan | Rendah |
| `jsonwebtoken` | 9.0.2 | Auth Token | Per semester | Rendah |
| `zustand` | 5.0.14 | State Management | Per quarter | Sedang |
| `typescript` | 5.8.3 | Type Checking | Per quarter | Rendah |
| `jest` | 29.6.3 | Testing Framework | Per quarter | Rendah |

