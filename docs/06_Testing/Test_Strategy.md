# Test Strategy
## Standar: ISO/IEC/IEEE 29119

---

## 1. Pendekatan Pengujian

Pengujian GSI One menggunakan pendekatan **Risk-Based Testing**, di mana fitur dengan dampak bisnis tertinggi (autentikasi, booking survei) mendapat prioritas pengujian paling tinggi.

---

## 2. Level Pengujian

| Level        | Deskripsi                                               | Alat        |
| ------------ | ------------------------------------------------------- | ----------- |
| Unit Testing | Menguji fungsi/modul terkecil secara terisolasi         | Jest        |
| Integration  | Menguji interaksi repository, store, service, dan Supabase mock | Jest |
| System       | Menguji keseluruhan alur dari perspektif pengguna       | Manual      |
| Acceptance   | Konfirmasi final oleh stakeholder                       | Manual (UAT)|

---

## 3. Strategi per Jenis Pengujian

### Unit Testing (Jest)
- Fokus pada: fungsi `validateForm()`, fungsi utility (`formatDate()`), logika Zustand store.
- Target coverage: minimal 60% untuk file dalam `src/store/` dan `src/services/`.

### Integration & Security Testing (Jest)
- `__tests__/integration/projectFlow.test.ts` memeriksa alur daftar proyek dan mutasi notifikasi.
- `__tests__/services/projectPagination.test.ts` memeriksa `range()` proyek/notifikasi.
- `__tests__/services/rlsMatrix.test.ts` memeriksa filter UUID untuk client, marketing, dan engineer.
- `__tests__/services/storageService.test.ts` memeriksa pembentukan signed URL dan error storage.
- Jalankan `npm run test:ci` untuk mode CI deterministik.

### Quality Gate

Workflow `.github/workflows/ci.yml` menjalankan `npm ci`, `npm run lint`, `npm run typecheck`, dan `npm run test:ci` pada push maupun pull request ke branch yang didukung.

### Functional Testing (Manual)
- Seluruh skenario dalam dokumen Test Cases dijalankan secara manual.
- Dilakukan di Android Emulator (API 30) dan iOS Simulator (iOS 16).

### Regression Testing
- Dijalankan setelah setiap perbaikan bug untuk memastikan tidak ada fitur lain yang rusak.
- Menggunakan subset test case prioritas High.

### User Acceptance Testing (UAT)
- Dilakukan oleh perwakilan tim marketing atau klien PT GSI.
- Skenario: alur booking survei end-to-end, melihat detail layanan.
- Dokumen UAT ditandatangani sebelum rilis production.
