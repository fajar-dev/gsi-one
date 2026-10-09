# Quality Metrics
## Proyek: GSI One Mobile Application

---

## 1. Metrik Kode (Code Metrics)

| Metrik                  | Target    | Kondisi Saat Ini | Alat Ukur  |
| ----------------------- | --------- | ---------------- | ---------- |
| Unit Test Coverage      | >= 60%    | ~15% (MVP)       | Jest       |
| ESLint Error            | 0         | 0                | ESLint     |
| ESLint Warning          | < 10      | TBD              | ESLint     |
| TypeScript `any` usage  | 0         | < 5 instances    | TSC        |
| Cyclomatic Complexity   | < 10/fungsi | TBD            | Manual     |

---

## 2. Metrik Performa Aplikasi

| Metrik                      | Target      | Kondisi Saat Ini |
| --------------------------- | ----------- | ---------------- |
| Time to Interactive (TTI)   | < 2 detik   | ~1.5 detik       |
| Skeleton visible duration   | 1.0-2.0 det | 1.5 detik (fixed)|
| API response time (login)   | < 1 detik   | TBD              |
| APK size (release)          | < 30 MB     | TBD              |
| RAM usage (idle)            | < 150 MB    | TBD              |

---

## 3. Metrik Kualitas Pengujian

| Metrik                    | Target   | Kondisi Saat Ini |
| ------------------------- | -------- | ---------------- |
| Test Case Pass Rate       | >= 95%   | TBD              |
| Bug Discovery Rate        | N/A      | TBD              |
| Open Critical/High Bugs   | 0        | 0 (post-UAT)     |
| Defect Removal Efficiency | >= 85%   | TBD              |

---

## 4. Metrik Bisnis (Post-Launch)

| Metrik                    | Target 3 Bulan | Cara Ukur               |
| ------------------------- | -------------- | ----------------------- |
| Jumlah Download           | 500+           | Play Store / App Store  |
| Rating Pengguna           | >= 4.0 / 5.0   | Play Store / App Store  |
| Booking via App           | 20+ per bulan  | Database booking        |
| Session per pengguna/bulan| >= 3 sesi      | Analytics (jika ada)    |
