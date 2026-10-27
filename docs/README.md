# Dokumentasi GSI One Mobile Application

Selamat datang di pusat dokumentasi resmi pengembangan aplikasi **GSI One Mobile** dari PT Graha Survei Indonesia.

---

## Membuka Portal HTML

Source dokumentasi disimpan sebagai Markdown. Sebelum membuka `docs/index.html`, jalankan dari root proyek:

```bash
node docs/generate_docs.js
```

HTML hasil generator dan `docs/docs_data.js` disimpan lokal serta diabaikan Git. Jalankan generator ini juga sebelum memublikasikan portal dokumentasi.

## Navigasi Dokumentasi Terpusat

### 1. Spesifikasi Persyaratan & Alur Aplikasi
- [Software Requirements Specification (SRS) - Full](02_Requirements/SRS_Full_Specification.md)
- [Software Requirement Specification (SRS) - Ringkas](02_Requirements/Software_Requirement_Specification.md)
- [Use Case Specification](02_Requirements/Use_Case_Specification.md)
- [User Stories Specification](02_Requirements/User_Stories.md)
- [Requirement Traceability Matrix (RTM)](02_Requirements/Requirement_Traceability_Matrix.md)

### 2. Arsitektur & Desain Perangkat Lunak
- [Arsitektur Sistem & SDLC](03_Architecture_Design/Architecture_And_SDLC.md)
- [Software Architecture Document (SAD)](03_Architecture_Design/Software_Architecture_Document.md)
- [Software Design Document (SDD)](03_Architecture_Design/Software_Design_Document.md)
- [Database Design Specification](03_Architecture_Design/Database_Design.md)
- [UI/UX Design Specification](03_Architecture_Design/UI_UX_Design.md)
- [ADR 0001: Scalability and Security Architecture](03_Architecture_Design/ADR/0001-scalability-and-security-architecture.md)

### 3. Spesifikasi API & Repositori Data
- [API & Repository Specification - Full](03_Architecture_Design/API_SPECIFICATION_Full.md)
- [API Specification - Konfigurasi](03_Architecture_Design/API_Specification.md)
- [API Catalog Documentation](03_Architecture_Design/API_Catalog_Documentation.md)
- [SLO Baseline](05_Quality_Assurance/SLO/SLO_BASELINE.md)

### 4. Panduan Developer & Refactoring
- [Panduan Arsitektur & Refactoring Maintainability](04_Development/Developer_Refactoring_Guide.md)
- [Developer Setup Guide](04_Development/Developer_Guide.md)
- [CI/CD Guide](07_Deployment/CI_CD_Guide.md)

### 5. Pengujian & Kualitas (QA)
- [Test Cases Specification](06_Testing/Test_Cases.md)
- [Daftar Test Case Manual Per Role](06_Testing/Daftar_Test_Case_Manual.txt)
- [Test Summary Report](06_Testing/Test_Summary_Report.md)
- [ISO/IEC 25010 Quality Assessment](10_Quality_Model/ISO25010_Quality_Assessment.md)

### 6. Panduan Pengguna & Administrator
- [User Manual](09_User_Documentation/User_Manual.md)
- [Administrator Guide](09_User_Documentation/Administrator_Guide.md)

### 7. Rencana Proyek
- [Project Tracking Specification](01_Project_Planning/Project_Tracking_Spec.md)
- [Project Management Plan](01_Project_Planning/Project_Management_Plan.md)
- [Cost Plan](01_Project_Planning/Cost_Plan.md)
- [Risk Register](01_Project_Planning/Risk_Register.md)

