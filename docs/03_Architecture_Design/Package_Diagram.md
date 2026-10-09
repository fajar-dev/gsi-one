# UML: Package Diagram Specification
## Proyek: GSI One Mobile Application & Express Backend API

Diagram Package memvisualisasikan pengorganisasian modul, direktori paket kode, dan ketergantungan antar-paket pada aplikasi frontend React Native dan backend Express.

```mermaid
graph TB
    subgraph FrontendPackages["Paket Frontend (src/)"]
        direction TB
        ScreensPkg["screens/\n(Login, Dashboard, Projects, BookSurvey)"]
        ComponentsPkg["components/\n(BottomNav, ScreenHeader, StatusBadge, Modals)"]
        HooksPkg["hooks/\n(useRoleTheme, useProjectDetail, useSurveyRequests)"]
        StorePkg["store/\n(authStore.ts, projectStore.ts - Zustand)"]
        DomainPkg["domain/\n(ProjectEntity.ts, SurveyRequestEntity.ts)"]
        ServicesPkg["services/\n(authService, projectService, notificationService)"]
        MappersPkg["services/mappers/\n(projectMapper.ts)"]
        ReposPkg["services/repositories/\n(IProjectRepository, SupabaseProjectRepository)"]
        SubReposPkg["services/repositories/sub/\n(ProjectQuery, ProjectStage, ProjectFile, ProjectCommand)"]
        UtilsPkg["utils/\n(errorHelpers, formatters, statusMapper, responsive, logger)"]
        ConfigPkg["config/\n(api.ts, supabase.ts)"]
        ThemePkg["theme/\n(Colors.tsx, GlobalStyle.tsx, roleTheme.ts)"]
        TypesPkg["types/\n(database.types.ts, index.ts)"]
    end

    subgraph BackendPackages["Paket Backend (backend/)"]
        direction TB
        ServerMain["server.js Entry Point"]
        RoutesPkg["backend/routes/\n(authRoutes, projectRoutes, bookingRoutes, fileRoutes, notificationRoutes)"]
        MiddlewaresPkg["backend/middlewares/\n(authMiddleware.js)"]
        HelpersPkg["backend/helpers/\n(projectHelpers.js)"]
        ConfigBackendPkg["backend/config/\n(supabase.js, multer.js)"]
        DBPkg["backend/database.js\n(SQLite connection & init)"]
    end

    ScreensPkg --> ComponentsPkg
    ScreensPkg --> HooksPkg
    ScreensPkg --> ThemePkg
    HooksPkg --> StorePkg
    StorePkg --> ServicesPkg
    ServicesPkg --> ReposPkg
    ReposPkg --> SubReposPkg
    SubReposPkg --> MappersPkg
    MappersPkg --> DomainPkg
    ServicesPkg --> ConfigPkg
    ServicesPkg --> UtilsPkg
    ConfigPkg --> TypesPkg

    ServerMain --> RoutesPkg
    RoutesPkg --> MiddlewaresPkg
    RoutesPkg --> HelpersPkg
    RoutesPkg --> ConfigBackendPkg
    RoutesPkg --> DBPkg
```
