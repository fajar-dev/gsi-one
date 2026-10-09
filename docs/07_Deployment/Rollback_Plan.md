# Rollback Plan
## Proyek: GSI One Mobile Application

---

## 1. Kapan Rollback Diperlukan

Rollback ke versi sebelumnya dilakukan jika setelah rilis production ditemukan:
- Crash fatal yang memengaruhi lebih dari 5% pengguna aktif.
- Fitur inti (login, booking) tidak dapat digunakan sama sekali.
- Kebocoran data atau celah keamanan kritis.

---

## 2. Prosedur Rollback

### Android (Google Play Store)
1. Login ke [Google Play Console](https://play.google.com/console).
2. Buka halaman Release > Production.
3. Pilih "Create new release" dan upload AAB versi sebelumnya yang masih tersimpan.
4. Google Play menyediakan fitur **Staged Rollout** untuk membatasi distribusi rollback ke % pengguna tertentu terlebih dahulu.

### iOS (Apple App Store)
1. Hubungi Apple Support untuk meminta penghentian distribusi versi terbaru (App Store tidak mendukung rollback langsung).
2. Upload IPA versi sebelumnya dari arsip Xcode dan submit sebagai rilis baru.

### Backend API (grahasurvei.com)
- Hubungi administrator server untuk melakukan rollback ke backup database terakhir jika diperlukan.

---

## 3. Penyimpanan Artefak Build

Setiap build release wajib disimpan di:
- **Google Drive / Server Internal**: folder `builds/gsione/<versi>/android/` dan `.../ios/`.
- Retention: minimal **3 versi** terakhir.

---

## 4. Prosedur Post-Rollback

1. Buat insiden report di `08_Maintenance/Incident_Report.md`.
2. Analisis akar masalah (root cause analysis).
3. Buat hotfix di branch `hotfix/<deskripsi>` dan uji sebelum rilis ulang.
