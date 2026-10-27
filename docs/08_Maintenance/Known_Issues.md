# Known Issues
## Proyek: GSI One Mobile Application & Supabase

---

Daftar masalah yang sudah diketahui dan status penanganannya.

---

## Tabel Masalah yang Diketahui (Known Issues Log)

| ID    | Kategori | Deskripsi Masalah | Severity | Dampak | Workaround | Target Fix | Status |
| ----- | -------- | ----------------- | -------- | ------ | ---------- | ---------- | ------ |
| KI-001 | Kualitas | Unit test coverage rendah (~15% pada modul UI) | Medium | Risiko regresi bug pada perubahan UI | Pengujian fungsional manual per role | v3.1.0 | Open |
| KI-002 | Teknis | Tidak ada mekanisme retry otomatis saat API timeout | Medium | Pengguna harus mengirim ulang secara manual | Tampilkan pesan error ramah dan tombol retry | v3.1.0 | Open |
| KI-003 | Aksesibilitas | Fitur screen reader belum diimplementasi | Low | Pengguna dengan disabilitas visual tidak terlayani | - | v4.0.0 | Open |
| KI-004 | DevOps | CI/CD pipeline belum otomatis di server produksi | Low | Build dan deploy masih manual via SSH | Gunakan langkah di Deployment Guide | v4.0.0 | Open |
| KI-005 | Data | Data katalog layanan bersifat statis (hardcoded di `structures.ts`) | Low | Pembaruan konten memerlukan deploy ulang | Edit langsung file `structures.ts` | v4.0.0 | Open |
| KI-006 | Fitur | Tidak ada push notification setelah booking diterima | Low | Klien tidak mendapat notifikasi instan | Tim GSI menghubungi klien via telepon/email | v4.0.0 | Open |
