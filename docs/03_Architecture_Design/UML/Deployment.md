# UML: Deployment Diagram

```mermaid
flowchart TB
    Play[Google Play / APK] --> Android[Perangkat Android]
    Store[App Store / TestFlight] --> IOS[Perangkat iOS]
    Hosting[Hosting bundle web] --> Web[Browser]
    Android --> Cloud[Supabase Cloud melalui HTTPS / WSS]
    IOS --> Cloud
    Web --> Cloud
    Cloud --> Auth[Auth]
    Cloud --> DB[PostgreSQL / RLS]
    Cloud --> Storage[Storage]
    Cloud --> Realtime[Realtime]
    Cloud --> Functions[Edge Functions]
```

Aplikasi tidak memerlukan proses server lokal tambahan. Prosedur deployment mencakup migrasi Supabase, Edge Function, konfigurasi environment client, serta distribusi bundle mobile/web.
