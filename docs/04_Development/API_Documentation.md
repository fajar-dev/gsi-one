# API Documentation (Development Guide)
## Proyek: GSI One Mobile Application

Dokumen ini berisi acuan pengintegrasian API & Repositori bagi tim pengembang GSI One Mobile.

---

## 1. Penggunaan Service & Repositori pada Custom Hooks

Pengembang dilarang memanggil Supabase Client SDK secara langsung di komponen UI. Seluruh pemanggilan data harus melalui Custom Hooks atau Service Facade.

### Contoh Penggunaan `useProjectDetail`
```typescript
import { useProjectDetail } from '../../hooks/useProjectDetail';

export function ProjectDetailContainer({ projectId }: { projectId: string }) {
    const { project, stages, logs, documents, loading, error, updateStage, addLog } = useProjectDetail(projectId);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <ProjectDetailView 
            project={project} 
            stages={stages} 
            logs={logs}
            documents={documents}
            onUpdateStage={updateStage}
            onAddLog={addLog}
        />
    );
}
```

### Contoh Penggunaan `useSurveyRequests`
```typescript
import { useSurveyRequests } from '../../hooks/useSurveyRequests';

export function SurveyRequestsContainer() {
    const { requests, loading, claimRequest, approveRequest, rejectRequest } = useSurveyRequests();
    // Render UI list & action buttons
}
```

Dokumen spesifikasi API lengkap dapat diakses pada:
[API_SPECIFICATION.md](file:///d:/GSI%20One%20-%20Copy/docs/API_SPECIFICATION.md)
