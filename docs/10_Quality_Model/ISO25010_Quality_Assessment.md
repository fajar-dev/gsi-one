# Evaluasi Kualitas Perangkat Lunak ISO/IEC 25010
## Proyek: GSI One Mobile Application & Supabase

---

## 1. Ikhtisar Standar ISO/IEC 25010

ISO/IEC 25010 mendefinisikan delapan karakteristik kualitas utama perangkat lunak. Berikut adalah hasil evaluasi komprehensif pada GSI One:

---

## 2. Tabel Evaluasi 8 Karakteristik Kualitas ISO 25010

| No | Karakteristik | Sub-Karakteristik | Skor | Bukti / Implementasi pada Codebase |
| --- | --- | --- | --- | --- |
| 1 | **Functional Suitability** | Functional Completeness | A | 100% pemenuhan FR (Auth, Booking, Project, Stages, Files, Notifications, Dashboard) |
| 1 | | Functional Correctness | A | 15 Test Suites, 74/74 tests passed (Jest) |
| 1 | | Functional Appropriateness | A | Alur Survey-to-Project & 4 tahapan standar sesuai proses bisnis GSI |
| 2 | **Performance Efficiency** | Time Behaviour | B+ | TTI < 2 detik, API login p50 < 200ms |
| 2 | | Resource Utilization | B | JSON body limit 10MB, static cache 7 hari (`maxAge: 7d`, `immutable`) |
| 2 | | Capacity | B | Pagination `limit`/`offset` pada listing proyek & notifikasi |
| 3 | **Compatibility** | Co-existence | A | Satu sumber data PostgreSQL Supabase |
| 3 | | Interoperability | A | REST API JSON standar, Supabase SDK, React Native cross-platform |
| 4 | **Usability** | Appropriateness Recognizability | A | Design tokens terpusat (`Colors.tsx`), role-based theme (`useRoleTheme`) |
| 4 | | Learnability | A | Onboarding < 5 menit, formulir intuitif |
| 4 | | Operability | A | Bottom tabs navigation, responsive layout 390px basis |
| 4 | | User Error Protection | B | Validasi form client-side, pesan error ramah (`errorHelpers.ts`) |
| 4 | | Accessibility | C | Screen reader belum diimplementasi (Known Issue KI-003) |
| 5 | **Reliability** | Maturity | B+ | 0 TypeScript errors, 0 unhandled exceptions pada alur utama |
| 5 | | Availability | B | SLO target >= 99.0% (rolling 30 hari) |
| 5 | | Fault Tolerance | B | Retry manual saat API timeout (Known Issue KI-002) |
| 5 | | Recoverability | B | Database trigger `sync_user_name_changes`, Rollback Plan tersedia |
| 6 | **Security** | Confidentiality | A | RLS aktif 7 tabel, Signed URL Supabase Storage privat |
| 6 | | Integrity | A | Policy RLS dan pemeriksaan role pada Edge Function |
| 6 | | Non-repudiation | B+ | JWT token autentikasi, `created_by` / `uploaded_by` audit trail |
| 6 | | Accountability | A | RBAC 4 peran (Admin, Marketing, Engineer, Client), pemantauan kegagalan Supabase Auth |
| 6 | | Authenticity | A | Sesi Supabase Auth dan pendaftaran akun melalui Edge Function admin |
| 7 | **Maintainability** | Modularity | A | Clean Architecture 5-layer, Repository Pattern, sub-repository facade |
| 7 | | Reusability | A | Shared components, design tokens, helper utilities terpusat |
| 7 | | Analysability | A | Structured logger (`logger.ts`), correlation ID |
| 7 | | Modifiability | A | DTO mapper (`projectMapper.ts`), tipe data terisolasi (`database.types.ts`) |
| 7 | | Testability | A | 15 Jest test suites, CI pipeline `.github/workflows/ci.yml` |
| 8 | **Portability** | Adaptability | A | React Native cross-platform (Android, iOS, Web) |
| 8 | | Installability | A | APK/AAB via Play Store, IPA via TestFlight |
| 8 | | Replaceability | B | Migrasi VPS terdokumentasi (Supabase Self-Hosted atau Custom REST API) |

---

## 3. Ringkasan Skor per Karakteristik

| Karakteristik | Skor Keseluruhan | Keterangan |
| --- | --- | --- |
| Functional Suitability | **A** | Seluruh requirement fungsional terpenuhi dan teruji |
| Performance Efficiency | **B+** | Pagination & caching aktif, SLO baseline terdefinisi |
| Compatibility | **A** | Dual-DB & REST API JSON interoperable |
| Usability | **B+** | UI intuitif, aksesibilitas screen reader belum ada |
| Reliability | **B+** | Stabil, retry otomatis belum tersedia |
| Security | **A** | RLS, Supabase Auth, RBAC, pendaftaran akun oleh admin |
| Maintainability | **A** | Clean Architecture, skor Grade A |
| Portability | **A** | Cross-platform Android, iOS, Web |
