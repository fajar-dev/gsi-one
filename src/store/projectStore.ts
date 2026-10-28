import { create } from 'zustand';
import type {
  Project,
  ProjectDetail,
  ProjectFileType,
  ProjectStageStatus,
} from '../domain/models/project';
import { projectService } from '../services/projectService';
import { useAuthStore } from './authStore';
import { getErrorMessage } from '../utils/errorHelpers';
import {
  calculateProjectStatistics,
  ProjectStatistics,
} from '../domain/models/projectStatistics';
import type { AuthUser } from '../domain/models/auth';

interface ProjectState {
  projects: Project[];
  selectedProject: ProjectDetail | null;
  stats: ProjectStatistics | null;
  isLoading: boolean;
  isLoadingDetail: boolean;
  detailRequestId: number;
  listRequestId: number;
  error: string | null;

  fetchProjects: () => Promise<void>;
  fetchProjectDetail: (projectId: string) => Promise<void>;
  updateStageStatus: (
    stageId: string,
    status: ProjectStageStatus,
  ) => Promise<void>;
  addStageUpdate: (
    stageId: string,
    description: string,
    progress: number,
  ) => Promise<void>;
  uploadFile: (
    projectId: string,
    stageId: string | null,
    fileName: string,
    fileType: ProjectFileType,
    fileUri?: string,
  ) => Promise<void>;
  createProject: (
    project: Omit<Project, 'id' | 'created_at' | 'status'>,
  ) => Promise<void>;
  createProjectStage: (
    projectId: string,
    title: string,
    description: string,
  ) => Promise<void>;
  updateProject: (
    projectId: string,
    updates: Omit<Project, 'id' | 'created_at' | 'created_by'>,
  ) => Promise<void>;
  updateProjectStage: (
    stageId: string,
    updates: { title: string; description: string },
  ) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  deleteProjectStage: (stageId: string) => Promise<void>;
  clearSelectedProject: () => void;
  resetForSession: () => void;
}

function requireProjectUser() {
  const user = useAuthStore.getState().user;
  if (!user)
    throw new Error('Sesi pengguna tidak ditemukan. Silakan masuk kembali.');
  return user;
}

interface MutationOptions {
  loading?: 'list' | 'detail';
  refreshList?: boolean;
  detailId?: string;
  clearDetail?: boolean;
}

export const useProjectStore = create<ProjectState>((set, get) => {
  let sessionRevision = 0;
  // A completed request may outlive its screen or the account that started it.
  const runMutation = async (
    operation: (user: AuthUser) => Promise<void>,
    options: MutationOptions = {},
  ): Promise<void> => {
    const user = requireProjectUser();
    const revision = sessionRevision;
    const detailVersion = get().detailRequestId;
    const listVersion = get().listRequestId;
    const initialDetailId = get().selectedProject?.id;
    const ownsSession = () =>
      revision === sessionRevision &&
      useAuthStore.getState().user?.id === user.id;
    const ownsDetail = () =>
      !options.detailId ||
      get().selectedProject?.id === options.detailId ||
      (!initialDetailId &&
        !get().selectedProject &&
        get().detailRequestId === detailVersion);
    if (options.loading === 'list') set({ isLoading: true, error: null });
    if (options.loading === 'detail')
      set({ isLoadingDetail: true, error: null });
    try {
      await operation(user);
      if (!ownsSession()) return;
      if (options.refreshList) await get().fetchProjects();
      if (!ownsSession()) return;
      if (options.clearDetail && ownsDetail()) get().clearSelectedProject();
      else if (options.detailId && ownsDetail())
        await get().fetchProjectDetail(options.detailId);
      if (!ownsSession()) return;
      if (options.loading === 'list' && get().listRequestId === listVersion)
        set({ isLoading: false });
      if (
        options.loading === 'detail' &&
        get().detailRequestId === detailVersion
      )
        set({ isLoadingDetail: false });
    } catch (error: unknown) {
      if (ownsSession() && ownsDetail())
        set({
          error: getErrorMessage(error),
          ...(options.loading === 'list' ? { isLoading: false } : {}),
          ...(options.loading === 'detail' ? { isLoadingDetail: false } : {}),
        });
      throw error;
    }
  };
  const selectedDetail = () => get().selectedProject?.id;
  return {
    projects: [],
    selectedProject: null,
    stats: null,
    isLoading: false,
    isLoadingDetail: false,
    detailRequestId: 0,
    listRequestId: 0,
    error: null,

    fetchProjects: async () => {
      const requestId = get().listRequestId + 1;
      const fetchingUserId = useAuthStore.getState().user?.id;
      set({ isLoading: true, error: null, listRequestId: requestId });
      try {
        const { user } = useAuthStore.getState();
        const projects = await projectService.getProjects(user?.id, user?.role);
        if (
          useAuthStore.getState().user?.id !== fetchingUserId ||
          get().listRequestId !== requestId
        )
          return;
        set({
          projects,
          stats: calculateProjectStatistics(projects),
          isLoading: false,
        });
      } catch (err: unknown) {
        if (
          useAuthStore.getState().user?.id === fetchingUserId &&
          get().listRequestId === requestId
        )
          set({ error: getErrorMessage(err), isLoading: false });
      }
    },

    fetchProjectDetail: async (projectId: string) => {
      const requestId = get().detailRequestId + 1;
      const userId = useAuthStore.getState().user?.id;
      set({
        isLoadingDetail: true,
        selectedProject:
          get().selectedProject?.id === projectId
            ? get().selectedProject
            : null,
        error: null,
        detailRequestId: requestId,
      });
      try {
        const { user } = useAuthStore.getState();
        const detail = await projectService.getProjectDetail(
          projectId,
          user?.role,
        );
        if (
          get().detailRequestId === requestId &&
          useAuthStore.getState().user?.id === userId
        ) {
          set({ selectedProject: detail, isLoadingDetail: false });
        }
      } catch (err: unknown) {
        if (
          get().detailRequestId === requestId &&
          useAuthStore.getState().user?.id === userId
        ) {
          set({
            error: getErrorMessage(err),
            isLoadingDetail: false,
          });
        }
      }
    },

    updateStageStatus: (stageId, status) =>
      runMutation(
        user => projectService.updateStageStatus(stageId, status, user.id),
        { detailId: selectedDetail() },
      ),
    addStageUpdate: (stageId, description, progress) =>
      runMutation(
        user =>
          projectService.addStageUpdate(
            stageId,
            description,
            progress,
            user.id,
          ),
        { detailId: selectedDetail() },
      ),
    uploadFile: (projectId, stageId, fileName, fileType, fileUri) =>
      runMutation(
        user =>
          projectService.uploadFieldFile(
            projectId,
            stageId,
            fileName,
            fileType,
            user.id,
            fileUri,
          ),
        { detailId: selectedDetail() },
      ),
    createProject: project =>
      runMutation(user => projectService.createProject(project, user.id), {
        loading: 'list',
        refreshList: true,
      }),
    createProjectStage: (projectId, title, description) =>
      runMutation(
        user =>
          projectService.createProjectStage(
            projectId,
            title,
            description,
            user.id,
          ),
        { loading: 'detail', detailId: projectId },
      ),
    updateProject: (projectId, updates) =>
      runMutation(() => projectService.updateProject(projectId, updates), {
        loading: 'list',
        refreshList: true,
        detailId: projectId,
      }),
    updateProjectStage: (stageId, updates) =>
      runMutation(() => projectService.updateProjectStage(stageId, updates), {
        loading: 'detail',
        detailId: selectedDetail(),
      }),
    deleteProject: projectId =>
      runMutation(() => projectService.deleteProject(projectId), {
        loading: 'list',
        refreshList: true,
        detailId: projectId,
        clearDetail: true,
      }),
    deleteProjectStage: stageId =>
      runMutation(() => projectService.deleteProjectStage(stageId), {
        loading: 'detail',
        detailId: selectedDetail(),
      }),

    resetForSession: () => {
      sessionRevision++;
      set({
        projects: [],
        selectedProject: null,
        stats: null,
        error: null,
        isLoading: false,
        isLoadingDetail: false,
        listRequestId: get().listRequestId + 1,
        detailRequestId: get().detailRequestId + 1,
      });
    },
    clearSelectedProject: () =>
      set({
        selectedProject: null,
        isLoadingDetail: false,
        detailRequestId: get().detailRequestId + 1,
      }),
  };
});
