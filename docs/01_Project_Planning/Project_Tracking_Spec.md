# Project Tracking & Development Progress
## Proyek: GSI One Mobile Application

---

## 1. Ringkasan Status Proyek

- **Status Pengembangan**: Produksi & Refactoring Selesai (Refactored Clean Architecture Active)
- **Skor Maintainability**: Grade A (Sangat Baik)
- **Pengujian Otomatis**: 15 Test Suites, 74 Unit Tests PASSED (100% Pass Rate)
- **Tipe Data**: Strict TypeScript (0 Errors)

---

## 2. Pelacakan Modul & Fitur Utama

| Modul | Status | Keterangan |
| --- | --- | --- |
| **Katalog Layanan (6 Layanan Utama)** | Completed | `LayananKamiScreen`, `LayananDetailScreen` aktif |
| **Studi Kasus Asesmen & SHMS** | Completed | `ServicesScreen`, `StructureDetailScreen` aktif |
| **Book Survey (Pengajuan Survei)** | Completed | Form publik & `SuccessScreen` aktif |
| **Survey Requests Pipeline** | Completed | Manajemen klaim persisten, RLS policy, & konversi proyek aktif |
| **Autentikasi & Admin Register** | Completed | Login Ticket/Email (dengan auto-repair), `AdminRegisterModal` dengan fitur Impor Booking Survey |
| **Logika Pembuatan Proyek** | Completed | Validasi ketat registrasi Klien (`role = 'client'`) & Hapus otomatis survey terkonversi |
| **Multi-Role Dynamic Dashboard** | Completed | Dashboards Admin, Marketing, Engineer, Client aktif |
| **Project Tracking (4 Tahapan)** | Completed | Linimasa, progress bar, daily log, dokumen aktif |
| **Clean Architecture Refactoring** | Completed | Modul terisolasi < 250 baris, Repository Facade & Sub-repositories, Jest Tests |

---

## 3. Log Pembaruan & Fitur Terbaru

### Pembaruan Keamanan, Refactoring Repository, & CI/CD Pipeline (2026-07-30)
1. **Refactoring Facade & Sub-Repositories (`SupabaseProjectRepository.ts`)**:
   - Memecah file 694 baris menjadi 4 sub-repository aggregate (`ProjectQueryRepository`, `ProjectStageRepository`, `ProjectFileRepository`, `ProjectCommandRepository`).
2. **Central Feature Registry (`src/features/`)**:
   - Mengorganisasi modul frontend ke dalam registry terpusat di `src/features/` (`auth`, `projects`, `notifications`).
3. **Storage Security & Signed URL (`storageService.ts`)**:
   - Mengunci Storage Bucket `projects` (`public = false`) dan menyediakan Signed URL berbatas waktu via `storageService.ts`.
   - Memperbarui trigger `handle_new_user()` dan RLS `users_update_policy` agar `ticket_number` langsung tersimpan otomatis.

### Pembaruan Logika Pembuatan Proyek & Survey Claim (2026-07-29)
1. **Pencegahan Pembuatan Proyek Tanpa Akun Klien Resmi**:
   - `CreateProjectScreen` & `useCreateProjectForm.ts`: Menolak penyimpanan proyek apabila Klien dari permohonan survey belum dibuatkan akun resmi oleh Admin (`role = 'client'`).
   - Mencegah *leak* di mana proyek dibuat atas nama Klien lain dan mencegah permohonan survey terhapus secara tidak sengaja.
2. **Penghapusan Otomatis Survey Terkonversi**:
   - Ketika proyek berhasil dibuat untuk Klien terdaftar dari permohonan survey, sistem secara otomatis menghapus survey tersebut dari tabel `bookings` database Supabase via `surveyService.deleteBooking(surveyBookingId)`.
3. **Persistensi Klaim Survey & Constraint DB**:
   - Memperbarui constraint database `bookings_status_check` di Supabase menjadi `CHECK (status IN ('pending', 'claimed', 'approved', 'rejected'))`.
   - Menambahkan kebijakan RLS `bookings_update_staff` dan `bookings_delete_admin`.
   - Menghapus *silent catch* pada `handleClaim()` dan memicu *re-fetch* data live dari database.
4. **Fitur Impor Data Booking Survey pada Registrasi Admin**:
   - `AdminRegisterModal.tsx`: Menambahkan dropdown selector *"Impor dari Booking Survey (Opsional)"*.
   - Mengisi otomatis **Nama Lengkap** dan **Email** calon Klien dari antrean booking survey, meminimalisir kesalahan ketik (*typo*).
