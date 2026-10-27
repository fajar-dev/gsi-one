# C4 Model

## Konteks dan container

GSI One melayani admin, marketing, engineer, dan klien melalui Android, iOS, serta web. Data bisnis berada di Supabase.

```mermaid
flowchart LR
    User[Pengguna] --> App[Aplikasi React Native / Web]
    App --> Auth[Supabase Auth]
    App --> DB[PostgreSQL / PostgREST / RLS]
    App --> Files[Supabase Storage]
    App --> Events[Supabase Realtime]
    App --> Admin[Edge Function admin-create-user]
    Admin --> Auth
    Admin --> DB
```

Kredensial privileged hanya digunakan pada Edge Function. Repository dan service aplikasi memakai sesi pengguna. Migrasi dan seed disimpan di `supabase/`.
