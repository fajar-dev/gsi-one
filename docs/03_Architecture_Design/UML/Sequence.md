# UML: Sequence Diagrams

## Login

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as Login
    participant Store as authStore
    participant Auth as Supabase Auth
    participant DB as PostgreSQL / RLS
    User->>UI: Email atau tiket dan password
    UI->>Store: login
    opt Identifier adalah tiket
      Store->>DB: RPC get_email_by_ticket_number
      DB-->>Store: Email
    end
    Store->>Auth: signInWithPassword
    Auth-->>Store: Sesi
    Store->>DB: Profil public.users
    DB-->>Store: Nama, role, tiket
    Store-->>UI: Dashboard sesuai role
```

## Booking dan proyek

```mermaid
sequenceDiagram
    actor User as Pengguna
    participant UI as Screen
    participant Service as Service / Repository
    participant DB as Supabase PostgreSQL
    User->>UI: Kirim booking
    UI->>Service: createBooking
    Service->>DB: INSERT bookings
    DB->>DB: Trigger notifikasi booking
    DB-->>UI: Berhasil
    User->>UI: Klaim booking
    UI->>Service: claimBooking
    Service->>DB: UPDATE status dan claimed_by
    User->>UI: Buat proyek sebagai admin
    UI->>Service: createProject
    Service->>DB: INSERT projects beserta penugasan
    opt Konversi dari booking
      Service->>DB: DELETE booking setelah proyek dibuat
    end
```

## Berkas dan realtime

Upload mengirim konten ke Storage dan kemudian mencatat metadata di `project_files`. Perubahan proyek, tahapan, serta catatan diterima oleh subscription pada detail proyek dan memicu pemuatan ulang. Kedua operasi upload/metadata belum berada dalam satu transaksi.
