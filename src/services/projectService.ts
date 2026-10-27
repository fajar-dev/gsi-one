import { SupabaseProjectRepository } from './repositories/SupabaseProjectRepository';
import { IProjectRepository } from './repositories/IProjectRepository';

export type ProjectStatus = 'pending' | 'on_progress' | 'done' | 'on_hold';

export type ProjectStageStatus = 'pending' | 'in_progress' | 'done';

export type ProjectFileType = 'image' | 'report' | 'invoice' | 'drawing' | 'contract' | 'video' | 'other';

export type ProjectUserRole = 'client' | 'marketing' | 'engineer';

export interface Project {
  id: string;
  project_code?: string;
  project_name: string;
  client_name: string;
  budget?: number;
  start_date: string;
  estimated_finish: string;
  status: ProjectStatus;
  created_by: string;
  client_id?: string;
  marketing_id?: string;
  engineer_id?: string;
  created_at: string;
}

export interface StageUpdate {
  id: string;
  stage_id: string | null;
  description: string;
  progress: number;
  created_by: string;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  stage_id: string | null;
  file_name: string;
  file_url: string;
  file_type: ProjectFileType;
  uploaded_by: string;
  created_at: string;
}

export interface ProjectStage {
  id: string;
  project_id: string;
  title: string;
  description: string;
  sequence: number;
  status: ProjectStageStatus;
  updated_by: string;
  updated_at: string;
  updates?: StageUpdate[];
  files?: ProjectFile[];
}

export interface ProjectDetail extends Project {
  stages: ProjectStage[];
  files?: ProjectFile[];
  updates?: StageUpdate[];
}

const projectRepository: IProjectRepository = new SupabaseProjectRepository();

export const projectService = {
  getProjects: (userId?: string, role?: string) => projectRepository.getProjects(userId, role),
  getProjectDetail: (projectId: string, role?: string) => projectRepository.getProjectDetail(projectId, role),
  updateStageStatus: (stageId: string, status: ProjectStageStatus, userId: string) => projectRepository.updateStageStatus(stageId, status, userId),
  addStageUpdate: (stageId: string, description: string, progress: number, userId: string) => projectRepository.addStageUpdate(stageId, description, progress, userId),
  uploadFieldFile: async (
    projectId: string,
    stageId: string | null,
    fileName: string,
    fileType: ProjectFileType,
    userId: string,
    fileUri?: string
  ) => {
    await projectRepository.uploadFile(projectId, stageId, fileName, fileType, userId, fileUri);
  },
  createProject: async (project: Omit<Project, 'id' | 'created_at' | 'status'>, userId: string) => {
    await projectRepository.createProject(project, userId);
  },
  createProjectStage: async (projectId: string, title: string, description: string, userId: string) => {
    await projectRepository.createProjectStage(projectId, title, description, userId);
  },
  getUsersByRole: (role: ProjectUserRole) => projectRepository.getUsersByRole(role),
  updateProject: async (projectId: string, updates: Omit<Project, 'id' | 'created_at' | 'created_by'>, _userId: string) => {
    await projectRepository.updateProject(projectId, updates);
  },
  updateProjectStage: async (stageId: string, updates: { title: string; description: string }, _userId: string) => {
    await projectRepository.updateProjectStage(stageId, updates);
  },
  deleteProject: (projectId: string) => projectRepository.deleteProject(projectId),
  deleteProjectStage: (stageId: string) => projectRepository.deleteProjectStage(stageId),
};
