# Communication Plan
## Proyek: GSI One Mobile Application

---

## 1. Tujuan

Memastikan seluruh pemangku kepentingan (stakeholder) mendapatkan informasi yang tepat, pada waktu yang tepat, melalui media yang tepat sepanjang siklus pengembangan proyek.

---

## 2. Matriks Komunikasi

| Jenis Komunikasi     | Frekuensi   | Peserta                     | Media           | Penanggung Jawab |
| -------------------- | ----------- | --------------------------- | --------------- | ---------------- |
| Daily Stand-up       | Harian      | Tim Developer               | WhatsApp / Meet | Lead Developer   |
| Sprint Review        | 2 Mingguan  | Developer, PM, PO           | Google Meet     | Project Manager  |
| Status Report        | Mingguan    | PM, Sponsor                 | Email / Notion  | Project Manager  |
| Demo ke Stakeholder  | Per Milestone | Semua stakeholder         | Presentasi langsung | PM + Dev   |
| Eskalasi Risiko      | Ketika perlu | PM, Sponsor, Lead Dev      | Telepon / Email | Project Manager  |
| Release Announcement | Per rilis    | Semua stakeholder + Klien  | Email + Notif App | Marketing     |

---

## 3. Saluran Komunikasi

| Saluran        | Penggunaan                              |
| -------------- | --------------------------------------- |
| WhatsApp Group | Komunikasi harian tim internal          |
| Google Meet    | Rapat formal, sprint review, demo       |
| Email          | Laporan resmi, persetujuan dokumen      |
| Notion         | Dokumentasi keputusan dan meeting notes |
| Git (PR)       | Review kode dan diskusi teknis          |

---

## 4. Eskalasi

Jika isu tidak terselesaikan dalam 24 jam di level tim, maka eskalasi ke Project Manager. Jika tidak terselesaikan dalam 48 jam, eskalasi ke Project Sponsor.

---

## 5. Matriks RACI (Responsible, Accountable, Consulted, Informed)

| Aktivitas / Deliverable | Project Manager | Lead Developer | Mobile Dev | QA Engineer | UI/UX Designer |
| --- | --- | --- | --- | --- | --- |
| Perencanaan Proyek & Milestone | **A** | C | I | I | I |
| Arsitektur Supabase & Edge Functions | C | **R/A** | I | C | - |
| Desain Skema PostgreSQL Supabase | I | **R/A** | C | I | - |
| Implementasi Frontend React Native | I | C | **R/A** | I | C |
| Konfigurasi RLS Policies Supabase | I | **R/A** | C | C | - |
| Pengujian Otomatis Jest | I | C | R | **R/A** | - |
| Audit Keamanan RLS dan Edge Function | C | **R/A** | I | R | - |
| Desain UI/UX & Design Tokens | I | C | C | - | **R/A** |
| Deployment & Release Management | **A** | R | C | R | - |
| Dokumentasi SDLC & Maintenance | **R/A** | C | I | I | - |

Keterangan:
- **R** = Responsible (Pelaksana)
- **A** = Accountable (Penanggung Jawab Akhir)
- **C** = Consulted (Dikonsultasi)
- **I** = Informed (Diberi Informasi)
