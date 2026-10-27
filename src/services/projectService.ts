import { SupabaseProjectRepository } from '../infrastructure/supabase/SupabaseProjectRepository';
import { IProjectRepository } from '../domain/repositories/IProjectRepository';

import type {
  Project,
  ProjectFileType,
  ProjectStageStatus,
  ProjectUserRole,
} from '../domain/models/project';

const projectRepository: IProjectRepository = new SupabaseProjectRepository();

export const projectService = {
  getProjects: (userId?: string, role?: string) =>
    projectRepository.getProjects(userId, role),
  getProjectDetail: (projectId: string, role?: string) =>
    projectRepository.getProjectDetail(projectId, role),
  updateStageStatus: (
    stageId: string,
    status: ProjectStageStatus,
    userId: string,
  ) => projectRepository.updateStageStatus(stageId, status, userId),
  addStageUpdate: (
    stageId: string,
    description: string,
    progress: number,
    userId: string,
  ) => projectRepository.addStageUpdate(stageId, description, progress, userId),
  uploadFieldFile: async (
    projectId: string,
    stageId: string | null,
    fileName: string,
    fileType: ProjectFileType,
    userId: string,
    fileUri?: string,
  ) => {
    await projectRepository.uploadFile(
      projectId,
      stageId,
      fileName,
      fileType,
      userId,
      fileUri,
    );
  },
  createProject: async (
    project: Omit<Project, 'id' | 'created_at' | 'status'>,
    userId: string,
  ) => {
    await projectRepository.createProject(project, userId);
  },
  createProjectStage: async (
    projectId: string,
    title: string,
    description: string,
    userId: string,
  ) => {
    await projectRepository.createProjectStage(
      projectId,
      title,
      description,
      userId,
    );
  },
  getUsersByRole: (role: ProjectUserRole) =>
    projectRepository.getUsersByRole(role),
  updateProject: async (
    projectId: string,
    updates: Omit<Project, 'id' | 'created_at' | 'created_by'>,
  ) => {
    await projectRepository.updateProject(projectId, updates);
  },
  updateProjectStage: async (
    stageId: string,
    updates: { title: string; description: string },
  ) => {
    await projectRepository.updateProjectStage(stageId, updates);
  },
  deleteProject: (projectId: string) =>
    projectRepository.deleteProject(projectId),
  deleteProjectStage: (stageId: string) =>
    projectRepository.deleteProjectStage(stageId),
};
