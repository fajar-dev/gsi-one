import type {
  Project,
  ProjectDetail,
  ProjectFileType,
  ProjectStageStatus,
} from '../models/project';

export interface UserOptionDto {
  id: string;
  name: string;
  email: string;
}

export interface PaginationOptions {
  limit?: number;
  offset?: number;
}

export interface IProjectRepository {
  getProjects(
    userId?: string,
    role?: string,
    options?: PaginationOptions,
  ): Promise<Project[]>;

  getProjectDetail(projectId: string, role?: string): Promise<ProjectDetail>;

  updateStageStatus(
    stageId: string,
    status: ProjectStageStatus,
    userId: string,
  ): Promise<void>;

  addStageUpdate(
    stageId: string,
    description: string,
    progress: number,
    userId: string,
  ): Promise<void>;

  uploadFile(
    projectId: string,
    stageId: string | null,
    fileName: string,
    fileType: ProjectFileType,
    userId: string,
    fileUri?: string,
  ): Promise<void>;

  createProject(
    project: Omit<Project, 'id' | 'created_at' | 'status'>,
    userId: string,
  ): Promise<void>;

  createProjectStage(
    projectId: string,
    title: string,
    description: string,
    userId: string,
  ): Promise<void>;

  updateProject(projectId: string, updates: Partial<Project>): Promise<void>;

  updateProjectStage(
    stageId: string,
    updates: { title: string; description: string },
  ): Promise<void>;

  deleteProject(projectId: string): Promise<void>;

  deleteProjectStage(stageId: string): Promise<void>;

  getUsersByRole(role: string): Promise<UserOptionDto[]>;
}
