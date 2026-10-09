# SLO Baseline — GSI One

Dokumen ini menetapkan target Service Level Objective (SLO) awal untuk sistem GSI One.

**Versi**: 1.1
**Tanggal penetapan**: 2026-07-31
**Pemilik**: Tim Engineering GSI One

---

## 1. Ketersediaan API (Availability)

| Endpoint Group | Target Availability | Measurement Window |
|---|---|---|
| Auth (`/api/login`, `/api/auth/*`) | >= 99.5% | Rolling 30 hari |
| Projects (`/api/projects`, `/api/stages/*`) | >= 99.0% | Rolling 30 hari |
| Bookings (`/api/bookings/*`) | >= 99.0% | Rolling 30 hari |
| Notifications (`/api/notifications`) | >= 99.0% | Rolling 30 hari |
| File Upload (`/api/files/upload`) | >= 98.0% | Rolling 30 hari |

**Definisi tersedia**: Endpoint mengembalikan respons HTTP dalam 5 detik dengan status bukan 5xx.

---

## 2. Latensi (p95 Target)

| Operasi | p50 Target | p95 Target | p99 Batas |
|---|---|---|---|
| Login | < 200ms | < 500ms | < 1000ms |
| List Proyek (20 item, dengan pagination) | < 300ms | < 800ms | < 1500ms |
| Detail Proyek (1 proyek + stages) | < 500ms | < 1200ms | < 2500ms |
| Update Status Stage | < 200ms | < 600ms | < 1200ms |
| Ambil Notifikasi (20 item) | < 200ms | < 600ms | < 1200ms |
| Upload File (< 10MB) | < 2000ms | < 5000ms | < 10000ms |

---

## 3. Alert Threshold

Alert harus diaktifkan ketika salah satu kondisi berikut terpenuhi selama window 5 menit:

| Alert | Kondisi Trigger |
|---|---|
| **API High Error Rate** | Error rate 5xx > 5% pada salah satu endpoint group |
| **Auth Slow Response** | p95 login > 1000ms |
| **Project List Degraded** | p95 list proyek > 2000ms |
| **Upload Failure Spike** | Error rate upload > 10% |
| **CORS Audit Warning Spike** | Penolakan origin CORS > 50 request per menit |
| **Realtime Channel Failure** | Lebih dari 5 kegagalan koneksi channel per menit |
| **Login Brute Force** | Rate limiter authLimiter aktif lebih dari 20x per IP dalam 15 menit |
