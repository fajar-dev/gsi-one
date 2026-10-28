# Peta codebase GSI One

Peta ini mengikuti struktur hasil refactor Oktober 2026. Aplikasi React Native berbagi domain dan workflow dengan versi web melalui adapter platform.

## Alur aplikasi

`index.js` → `App.tsx` → `useAppSession` dan `AppNavigator` → screen → hook/store/service → repository Supabase → PostgreSQL, Auth, Storage, dan Realtime.

`App.tsx` memasang ErrorBoundary, SafeAreaProvider, indikator inisialisasi, dan frame web. `src/navigation/AppNavigator.tsx` mendefinisikan stack bertipe; `AuthenticatedTabs.tsx` menangani tab pengguna. `src/hooks/useAppSession.ts` menangani pemulihan sesi, deep link reset kata sandi, pembersihan data privat, serta langganan notifikasi.

## Batas modul

| Direktori                                       | Tanggung jawab                                                             |
| ----------------------------------------------- | -------------------------------------------------------------------------- |
| `src/domain/models/`                            | Model autentikasi/proyek/notifikasi, progres tahapan, dan statistik proyek |
| `src/domain/entities/`, `enums/`, `validation/` | Aturan bisnis, peran, status, dan validasi pendaftaran                     |
| `src/domain/repositories/`                      | Kontrak repository proyek dan booking survey                               |
| `src/infrastructure/supabase/`                  | Implementasi autentikasi, notifikasi, repository, profil, dan Storage      |
| `src/infrastructure/supabase/projects/`         | Pemisahan query proyek, mutasi master, tahapan, dan file                   |
| `src/infrastructure/supabase/mappers/`          | Pemetaan row database menjadi model domain                                 |
| `src/services/`                                 | Facade aplikasi yang mendelegasikan operasi ke infrastruktur               |
| `src/store/`                                    | Zustand auth, proyek, dan notifikasi; isolasi respons antar sesi           |
| `src/hooks/`                                    | Lifecycle sesi, data proyek, survey, realtime, dan pendaftaran pengguna    |
| `src/screens/`                                  | Halaman per fitur; hook dan style khusus fitur berada dekat pemakainya     |
| `src/components/`                               | Komponen reusable, ErrorBoundary, ErrorNotice, dan ActionButton            |
| `src/theme/`                                    | `tokens.ts`, `colors.ts`, dan `roleTheme.ts`                               |
| `src/platform/`                                 | Registrasi font dan adapter browser untuk picker/gradient                  |
| `src/config/`                                   | Client Supabase dan persistensi sesi                                       |
| `src/types/`                                    | Tipe database, navigasi, environment, dan aset                             |
| `src/data/`                                     | Katalog layanan, struktur, dan artikel publik                              |
| `test/mocks/`, `__tests__/`                     | Mock khusus pengujian dan suite Jest                                       |
| `supabase/migrations/`                          | Riwayat skema, policy RLS, indeks, dan trigger                             |
| `supabase/functions/admin-create-user/`         | Pendaftaran pengguna dengan pemeriksaan peran admin                        |
| `supabase/seed.sql`                             | Seed SQL mandiri untuk akun dan proyek demo                                |
| `scripts/`                                      | Pemeriksaan arsitektur/graf modul, fixture Storage, dan benchmark          |
| `android/`, `ios/`                              | Proyek platform native                                                     |

Domain tidak mengimpor UI, store, service, maupun SDK. Screen tidak mengimpor Supabase atau AsyncStorage. Implementasi infrastruktur tidak bergantung pada presentation layer. `npm run audit:architecture` menegakkan batas tersebut dan menolak explicit `any` di source aplikasi. Integrasi SDK autentikasi dan notifikasi juga berada di infrastruktur; facade service menjaga pemanggilan dari hook/store tetap sederhana.

## Halaman dan workflow

- `Home`, `Services`, `Structures`, `Insight`, `AboutUs`, dan `Partners`: katalog dan konten publik.
- `Login`: login staf/klien, bantuan registrasi, permintaan email reset, dan penyimpanan kata sandi baru.
- `Dashboard`: tampilan admin, marketing, engineer, dan klien. Statistik klien dihitung dari data tahapan tersimpan.
- `BookSurvey`: formulir publik, konfirmasi, daftar permohonan, klaim, dan penghapusan sesuai peran.
- `Projects`: daftar/pencarian/filter/pagination, pembuatan/edit proyek, tahapan, catatan, dan file privat.
- `Profile`: profil, edit nama, dan pendaftaran pengguna oleh admin melalui `useUserRegistration`.
- `Notifications`: daftar berhalaman dan status baca; notifikasi dibuat oleh trigger server.

Model bersama diimpor langsung dari domain. Token UI digunakan melalui theme; `ActionButton` menetapkan target sentuh dasar 44, dan `ErrorNotice` menyediakan status gagal serta retry. `*.styles.ts` memisahkan style statis halaman yang panjang.

## Pengembangan dan verifikasi

Gunakan Node.js 24 (`.nvmrc`), minimum 22.15.0, dan JDK 17. Environment diambil dari `.env`; jangan masukkan service-role key ke aplikasi.

```bash
npm ci
npm run check
npm audit --audit-level=moderate
npm run build:web
npm run start
npm run android
```

Jika ADB tersambung ulang, jalankan `adb devices -l` dan `adb reverse tcp:8081 tcp:8081`. APK debug memerlukan Metro. Build native: `cd android` lalu `./gradlew :app:assembleDebug -PreactNativeArchitectures=arm64-v8a --max-workers=2`.

`npm run audit:assets` memeriksa referensi gambar/font/media, termasuk fixture yang dipakai skrip seed, serta menolak aset tanpa pemakai. Build web membersihkan file dengan hash lama dan mempertahankan folder paket rilis.

`npm run audit:modules` memeriksa modul aplikasi yang tidak terjangkau dan siklus impor, termasuk adapter platform. TypeScript menolak local/parameter yang tidak digunakan. Tes konkurensi mencakup login/logout, mutasi proyek, dan antrean notifikasi; reset sesi membatalkan penerapan respons lama.

State loading login, logout, dan pengiriman reset password dipisahkan. Event Auth tidak memulai restore selama login/logout aktif; logout menunggu login lama selesai sebelum membersihkan sesi SDK. Navigator melepas layar privat ketika sesi berakhir. Request Supabase dibatasi 15 detik (unggahan berkas 60 detik), dan web memakai AlertHost karena Alert bawaan React Native Web tidak menampilkan dialog.

Quality gate lokal tidak membuktikan seluruh perangkat/platform atau jaringan bebas masalah. Laporan JSON di `audit/` menyimpan hasil dan keterbatasan tiap pengujian; laporan lama tetap menjadi bukti historis.
