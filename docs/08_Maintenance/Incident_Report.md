# Incident Report Log
## Proyek: GSI One Mobile Application

---

Template dan riwayat insiden produksi.

---

## Template Laporan Insiden

```
ID Insiden    : INC-XXX
Tanggal/Waktu : YYYY-MM-DD HH:MM WIB
Dilaporkan oleh: [Nama / Tim]
Severity      : Critical / High / Medium / Low
Status        : Open / In Progress / Resolved / Closed

Deskripsi Masalah:
[Jelaskan gejala yang terjadi]

Dampak:
[Siapa yang terdampak dan seberapa luas]

Akar Masalah (Root Cause):
[Setelah investigasi, apa penyebab utamanya]

Langkah Penanganan:
1. [Langkah pertama]
2. [Langkah kedua]

Resolusi:
[Apa yang dilakukan untuk memperbaiki masalah]

Waktu Resolusi: [Durasi dari insiden terdeteksi hingga selesai]

Tindakan Pencegahan:
[Apa yang perlu dilakukan agar insiden ini tidak terulang]
```

---

## Riwayat Insiden (Incident Log Table)

| ID Insiden | Tanggal | Severity | Modul Terdampak | Deskripsi Masalah | Root Cause | Resolusi | Durasi | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

---

## Tabel Klasifikasi Severity Insiden

| Severity | Definisi | SLA Respons | SLA Resolusi |
| --- | --- | --- | --- |
| Critical | Seluruh layanan tidak bisa diakses (down total) | 15 menit | 2 jam |
| High | Fitur utama terganggu (login, booking, project tracking) | 30 menit | 4 jam |
| Medium | Fitur sekunder terganggu atau performa menurun signifikan | 2 jam | 24 jam |
| Low | Gangguan minor, kosmetik, atau informasional | 24 jam | 72 jam |
