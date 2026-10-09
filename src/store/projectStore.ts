import { create } from 'zustand';
import { projectService, Project, ProjectDetail, ProjectFileType, ProjectStageStatus } from '../services/projectService';
import { useAuthStore } from './authStore';
import { getErrorMessage } from '../utils/errorHelpers';
import { ProjectStatusEnum } from '../domain/enums/ProjectStatus';


interface DashboardStats {
  total: number;
  on_progress: number;
  done: number;
  pending: number;
  on_hold: number;
}

interface ProjectState {
  projects: Project[];
  selectedProject: ProjectDetail | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProjectDetail: (projectId: string) => Promise<void>;
  updateStageStatus: (stageId: string, status: ProjectStageStatus) => Promise<void>;
  addStageUpdate: (stageId: string, description: string, progress: number) => Promise<void>;
  uploadFile: (projectId: string, stageId: string | null, fileName: string, fileType: ProjectFileType, fileUri?: string) => Promise<void>;
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'status'>) => Promise<void>;
  createProjectStage: (projectId: string, title: string, description: string) => Promise<void>;
  updateProject: (projectId: string, updates: Omit<Project, 'id' | 'created_at' | 'created_by'>) => Promise<void>;
  updateProjectStage: (stageId: string, updates: { title: string; description: string }) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  deleteProjectStage: (stageId: string) => Promise<void>;
  computeStats: () => void;
  clearSelectedProject: () => void;
  clearError: () => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  stats: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,

  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const projects = await projectService.getProjects(user?.id, user?.role);
      set({ projects, isLoading: false });
      get().computeStats();
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
    }
  },

  fetchProjectDetail: async (projectId: string) => {
    set({ isLoadingDetail: true, error: null });
    try {
      const { user } = useAuthStore.getState();
      const detail = await projectService.getProjectDetail(projectId, user?.role);
      set({ selectedProject: detail, isLoadingDetail: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoadingDetail: false });
    }
  },

  updateStageStatus: async (stageId, status) => {
    const { user } = useAuthStore.getState();
    // Melempar, bukan `return` seperti sebelumnya: dengan `return` operasi tidak
    // terjadi apa-apa tetapi UI tetap melaporkan "berhasil" (promise resolve).
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    try {
      await projectService.updateStageStatus(stageId, status, user.id);
      const { selectedProject } = get();
      if (selectedProject) {
        await get().fetchProjectDetail(selectedProject.id);
      }
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
      throw err;
    }
  },

  addStageUpdate: async (stageId, description, progress) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    try {
      await projectService.addStageUpdate(stageId, description, progress, user.id);
      const { selectedProject } = get();
      if (selectedProject) {
        await get().fetchProjectDetail(selectedProject.id);
      }
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
      throw err;
    }
  },

  uploadFile: async (projectId, stageId, fileName, fileType, fileUri) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    try {
      await projectService.uploadFieldFile(projectId, stageId, fileName, fileType, user.id, fileUri);
      const { selectedProject } = get();
      if (selectedProject) {
        await get().fetchProjectDetail(selectedProject.id);
      }
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
      throw err;
    }
  },

  createProject: async (project) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    set({ isLoading: true, error: null });
    try {
      await projectService.createProject(project, user.id);
      await get().fetchProjects();
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  createProjectStage: async (projectId, title, description) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    set({ isLoadingDetail: true, error: null });
    try {
      await projectService.createProjectStage(projectId, title, description, user.id);
      await get().fetchProjectDetail(projectId);
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoadingDetail: false });
      throw err;
    }
  },

  updateProject: async (projectId, updates) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    set({ isLoading: true, error: null });
    try {
      await projectService.updateProject(projectId, updates, user.id);
      await get().fetchProjects();
      await get().fetchProjectDetail(projectId);
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  updateProjectStage: async (stageId, updates) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    set({ isLoadingDetail: true, error: null });
    try {
      await projectService.updateProjectStage(stageId, updates, user.id);
      const { selectedProject } = get();
      if (selectedProject) {
        await get().fetchProjectDetail(selectedProject.id);
      }
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoadingDetail: false });
      throw err;
    }
  },

  deleteProject: async (projectId) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    set({ isLoading: true, error: null });
    try {
      await projectService.deleteProject(projectId);
      await get().fetchProjects();
      set({ selectedProject: null, isLoading: false });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoading: false });
      throw err;
    }
  },

  deleteProjectStage: async (stageId) => {
    const { user } = useAuthStore.getState();
    if (!user) { throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.'); }
    set({ isLoadingDetail: true, error: null });
    try {
      await projectService.deleteProjectStage(stageId);
      const { selectedProject } = get();
      if (selectedProject) {
        await get().fetchProjectDetail(selectedProject.id);
      }
    } catch (err: unknown) {
      set({ error: getErrorMessage(err), isLoadingDetail: false });
      throw err;
    }
  },

  computeStats: () => {
    const { projects } = get();
    const stats = projects.reduce<DashboardStats>(
      (acc, p) => {
        acc.total++;
        if (p.status === ProjectStatusEnum.ON_PROGRESS) acc.on_progress++;
        else if (p.status === ProjectStatusEnum.DONE) acc.done++;
        else if (p.status === ProjectStatusEnum.PENDING) acc.pending++;
        else if (p.status === ProjectStatusEnum.ON_HOLD) acc.on_hold++;
        return acc;
      },
      { total: 0, on_progress: 0, done: 0, pending: 0, on_hold: 0 }
    );
    set({ stats });
  },

  clearSelectedProject: () => set({ selectedProject: null }),
  clearError: () => set({ error: null }),
}));


export const useProjectList = () => useProjectStore(state => state.projects);

export const useProjectDetail = () => useProjectStore(state => state.selectedProject);

export const useProjectListLoading = () => useProjectStore(state => state.isLoading);

export const useProjectDetailLoading = () => useProjectStore(state => state.isLoadingDetail);

export const useProjectError = () => useProjectStore(state => state.error);

export const useProjectStats = () => useProjectStore(state => state.stats);

export const useProjectActions = () => useProjectStore(state => ({
  fetchProjects: state.fetchProjects,
  fetchProjectDetail: state.fetchProjectDetail,
  updateStageStatus: state.updateStageStatus,
  addStageUpdate: state.addStageUpdate,
  uploadFile: state.uploadFile,
  createProject: state.createProject,
  createProjectStage: state.createProjectStage,
  updateProject: state.updateProject,
  updateProjectStage: state.updateProjectStage,
  deleteProject: state.deleteProject,
  deleteProjectStage: state.deleteProjectStage,
  computeStats: state.computeStats,
  clearSelectedProject: state.clearSelectedProject,
  clearError: state.clearError,
}));
