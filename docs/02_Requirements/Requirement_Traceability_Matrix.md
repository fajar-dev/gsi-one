# Requirement Traceability Matrix (RTM)
## Proyek: GSI One Mobile Application

---

## Matriks Penelusuran Persyaratan (RTM)

| ID Kebutuhan (FR) | Deskripsi Kebutuhan | User Story | Use Case | Komponen Kode / Screen | Tes Automasi Jest |
| --- | --- | --- | --- | --- | --- |
| **FR-AUTH-01** | Login via Nomor Tiket / Email | US-CLI-01 | UC-02 | `LoginScreen.tsx`, `authStore.ts` | `authRepository.test.ts` |
| **FR-AUTH-02** | Pendaftaran Akun Terpusat (Admin) | US-ADM-01 | UC-01 | `AdminRegisterModal.tsx` | `adminUserCreation.test.ts` |
| **FR-AUTH-03** | Persistensi Sesi AsyncStorage | US-CLI-01 | UC-02 | `useAuthStore.ts` | `sessionPersistence.test.ts` |
| **FR-PUBLIC-01** | Katalog 6 Layanan GSI | US-PUB-01 | - | `LayananKamiScreen.tsx` | `services.test.ts` |
| **FR-PUBLIC-02** | Detail Layanan & Risk Card | US-PUB-01 | - | `LayananDetailScreen.tsx` | `serviceDetail.test.ts` |
| **FR-BOOK-01** | Form Pengajuan Survei | US-PUB-03 | UC-03 | `BookSurveyScreen.tsx` | `surveyRequest.test.ts` |
| **FR-SURVEY-01** | Klaim & Approval Permohonan | US-MKT-01, US-MKT-03 | UC-04 | `SurveyRequestsScreen.tsx` | `surveyStatus.test.ts` |
| **FR-SURVEY-02** | Konversi Permohonan ke Proyek | US-MKT-04, US-ADM-02 | UC-05 | `CreateProjectScreen.tsx` | `surveyConversion.test.ts` |
| **FR-PROJ-01** | Pembuatan Proyek & 4 Tahapan | US-ADM-02 | UC-05 | `CreateProjectScreen.tsx` | `projectEntity.test.ts` |
| **FR-PROJ-02** | Linimasa Tahapan & Progres % | US-ENG-02, US-CLI-02 | UC-06 | `ProjectDetailScreen.tsx` | `projectStage.test.ts` |
| **FR-LOG-01** | Catatan Harian Pekerjaan Lapangan | US-ENG-03 | UC-06 | `AddLogModal.tsx` | `dailyLog.test.ts` |
| **FR-DOC-01** | Manajemen PDF Laporan & Foto | US-ENG-04, US-CLI-03 | UC-07 | `UploadFileModal.tsx` | `documentUpload.test.ts` |
| **FR-DASH-01** | Multi-Role Dynamic Dashboard | ALL | UC-01 s/d UC-07 | `Dashboard/index.tsx` | `roleRouting.test.ts` |

---

## Matriks Hak Akses per Role (RBAC Permission Matrix)

| Modul / Fitur | Admin | Marketing | Engineer | Client | Publik |
| --- | --- | --- | --- | --- | --- |
| Login via Email / Nomor Tiket | Ya | Ya | Ya | Ya | Tidak |
| Buat Akun Pengguna Baru (Register) | Ya | Tidak | Tidak | Tidak | Tidak |
| Lihat Dashboard Statistik Global | Ya | Tidak | Tidak | Tidak | Tidak |
| Lihat Katalog Layanan & Studi Kasus | Ya | Ya | Ya | Ya | Ya |
| Ajukan Booking Survei Lokasi | Ya | Ya | Tidak | Ya | Ya |
| Klaim Permohonan Survei (`claimed`) | Ya | Ya | Tidak | Tidak | Tidak |
| Setujui / Tolak Booking (`approved`/`rejected`) | Ya | Ya | Tidak | Tidak | Tidak |
| Konversi Booking ke Proyek Baru | Ya | Ya | Tidak | Tidak | Tidak |
| Buat Proyek Baru | Ya | Tidak | Tidak | Tidak | Tidak |
| Lihat Semua Proyek | Ya | Ya | Tidak | Tidak | Tidak |
| Lihat Proyek yang Ditugaskan / Dimiliki | Ya | Ya | Ya | Ya | Tidak |
| Update Status Tahapan Proyek (Stages) | Ya | Tidak | Ya | Tidak | Tidak |
| Tambah Log Harian (`stage_updates`) | Ya | Tidak | Ya | Tidak | Tidak |
| Upload Berkas / Foto Inspeksi | Ya | Tidak | Ya | Tidak | Tidak |
| Download Berkas Laporan PDF | Ya | Ya | Ya | Ya | Tidak |
| Terima Notifikasi In-App | Ya | Ya | Ya | Ya | Tidak |
| Hapus Proyek | Ya | Tidak | Tidak | Tidak | Tidak |
| Kelola RLS & Database Trigger | Ya | Tidak | Tidak | Tidak | Tidak |

---

## Matriks Keterlacakan Layanan

| Operasi | Implementasi | Layanan |
| --- | --- | --- |
| Login dan tiket | `authService.ts` | Supabase Auth dan RPC |
| Pembuatan akun | `admin-create-user/index.ts` | Edge Function dan Auth Admin API |
| Proyek, tahapan, catatan, metadata file | `repositories/sub/` | PostgREST dan RLS |
| Booking | `SupabaseSurveyRepository.ts` | PostgREST dan trigger |
| Notifikasi | `notificationService.ts` | PostgREST dan RLS |
| Upload | `ProjectFileRepository.ts` | Supabase Storage |
