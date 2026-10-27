# UML: Object Diagram Specification
## Proyek: GSI One Mobile Application & Supabase

Diagram Object memvisualisasikan snapshot memory instance nyata dari entitas proyek, tahapan, log harian, dan dokumen terhubung pada saat runtime aplikasi.

```mermaid
classDiagram
    class activeProject {
        id = "prj-uuid-101"
        project_code = "PRJ-2026-001"
        name = "Audit Struktur Jembatan Cisadane"
        client_id = "user-uuid-client-1"
        client_name = "PT Wijaya Karya"
        marketing_id = "user-uuid-mkt-1"
        assigned_engineer_id = "user-uuid-eng-1"
        status = "on_progress"
        progress_percentage = 45
        start_date = "2026-06-01"
        estimated_finish = "2026-08-31"
    }

    class stage1 {
        id = "stg-uuid-1"
        stage_name = "1. Inisiasi & Persiapan"
        sequence = 1
        status = "done"
        progress_percentage = 100
    }

    class stage2 {
        id = "stg-uuid-2"
        stage_name = "2. Survei & Inspeksi Lapangan"
        sequence = 2
        status = "in_progress"
        progress_percentage = 80
    }

    class stage3 {
        id = "stg-uuid-3"
        stage_name = "3. Analisis & Laporan"
        sequence = 3
        status = "pending"
        progress_percentage = 0
    }

    class stage4 {
        id = "stg-uuid-4"
        stage_name = "4. Selesai & Handover"
        sequence = 4
        status = "pending"
        progress_percentage = 0
    }

    class dailyLog1 {
        id = "log-uuid-1"
        log_date = "2026-06-15"
        activity_summary = "Pengujian Hammer Test & NDT pada pilar P1-P4"
        issues_notes = "Akses pilar P3 terkendala pasang air sungai"
    }

    class projectFile1 {
        id = "file-uuid-1"
        file_name = "Laporan_Awal_Survei_Jembatan.pdf"
        file_type = "report"
        file_url = "projects/PRJ-2026-001/Laporan_Awal_Survei_Jembatan.pdf"
    }

    activeProject *-- stage1 : memuat
    activeProject *-- stage2 : memuat
    activeProject *-- stage3 : memuat
    activeProject *-- stage4 : memuat
    stage2 o-- dailyLog1 : dikaitkan dengan
    activeProject o-- projectFile1 : memiliki berkas
```
