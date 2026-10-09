# C4 Architecture Model Specification
## Proyek: GSI One Mobile Application & Express Backend API
## Standar: C4 Model (Context & Container Levels)

---

## 1. C4 Level 1: System Context Diagram

Diagram System Context memvisualisasikan batas ekosistem perangkat lunak GSI One, aktor yang terlibat, serta sistem eksternal yang terhubung.

```mermaid
graph TB
    subgraph Users["Aktor Pengguna (Users)"]
        PublicUser["Pengunjung Publik\n(Calon Klien)"]
        ClientUser["Client Terdaftar\n(Pemilik Proyek)"]
        EngineerUser["Field Engineer\n(Insinyur Lapangan)"]
        MarketingUser["Staf Marketing\n(Pengelola Booking)"]
        AdminUser["System Administrator\n(Pengelola Akun & Proyek)"]
    end

    subgraph SystemBoundary["Batas Sistem GSI One (System Boundary)"]
        GSISystem["GSI One System\n(Mobile App, Web App, & REST API)\nMenyediakan katalog layanan, booking survei,\ntracking 4 tahapan proyek, & manajemen berkas."]
    end

    subgraph ExternalSystems["Sistem Eksternal (External Systems)"]
        SupabaseCloud["Supabase Cloud Platform\n(PostgreSQL DB, Auth, Realtime WS, Storage)"]
        AppDistribution["Store Distribution\n(Google Play Store & Apple App Store)"]
        NotificationGateway["Push / Email Notification Gateway\n(Notifikasi In-App & Event Alert)"]
    end

    PublicUser -->|"Lihat katalog & kirim booking survei"| GSISystem
    ClientUser -->|"Pantau progress realtime & download laporan PDF"| GSISystem
    EngineerUser -->|"Update status stage, input log harian, & upload file"| GSISystem
    MarketingUser -->|"Klaim, approve/reject booking, & konversi proyek"| GSISystem
    AdminUser -->|"Buat akun terpusat, buat proyek, & kelola sistem"| GSISystem

    GSISystem <-->|"Kueri DB, Auth RLS, WebSocket, & File Storage"| SupabaseCloud
    GSISystem -->|"Distribusi biner APK/AAB & IPA"| AppDistribution
    GSISystem -->|"Pengiriman alert & notifikasi"| NotificationGateway
```

---

## 2. C4 Level 2: Container Diagram

Diagram Container memvisualisasikan arsitektur kontainer internal aplikasi (Mobile React Native, Web App, Express REST Backend, Supabase Auth, PostgreSQL DB, dan Storage Bucket).

```mermaid
graph TB
    subgraph Users["Aktor Pengguna"]
        ClientUser["Client & Publik"]
        EngineerUser["Field Engineer"]
        AdminMktUser["Admin & Marketing"]
    end

    subgraph FrontendContainers["Kontainer Klien (Frontend Application)"]
        MobileApp["React Native Mobile App\n[Container: JavaScript/TypeScript]\nAplikasi Android & iOS berbasis React Native 0.83.\nZustand State, Custom Hooks, Repository Pattern."]
        WebApp["React Native Web App\n[Container: React Web]\nDashboard web browser untuk akses desktop."]
    end

    subgraph BackendContainers["Kontainer Server (Backend Application)"]
        ExpressAPI["Express REST API Server\n[Container: Node.js / Express]\nServer backend di VPS (server.js).\nCORS Audit, Helmet Headers, Rate Limiter, JWT Auth."]
        LocalSQLite["SQLite Database\n[Container: SQLite3]\nDatabase lokal untuk development & fallback testing."]
    end

    subgraph SupabaseContainers["Kontainer Cloud (Supabase Managed BaaS)"]
        SupaAuth["Supabase Auth Engine\n[Container: GoTrue Service]\nAutentikasi JWT & Manajemen Sesi Pengguna."]
        SupaPostgres[("Supabase PostgreSQL DB\n[Container: PostgreSQL 15]\n7 Tabel Utama, RLS Policies, Triggers, & Indices.")]
        SupaStorage["Supabase Object Storage\n[Container: S3 Compatible Storage]\nBucket Privat 'projects/' untuk foto & laporan PDF."]
        SupaRealtime["Supabase Realtime Service\n[Container: Elixir/Phoenix WebSocket]\nPropagasi event stage update per proyek secara realtime."]
    end

    ClientUser & EngineerUser & AdminMktUser -->|"Menggunakan"| MobileApp & WebApp
    MobileApp & WebApp -->|"HTTP Request / JSON (Bearer JWT)"| ExpressAPI
    MobileApp & WebApp -->|"HTTPS REST / WebSocket (Anon Key)"| SupaGateway

    subgraph SupaGateway["Supabase Gateway"]
        SupaAuth
        SupaPostgres
        SupaStorage
        SupaRealtime
    end

    ExpressAPI -->|"Direct DB Queries (SQLite Dev)"| LocalSQLite
    ExpressAPI -->|"Service Role Key (Admin Auth & Notif Dispatch)"| SupaPostgres
```
