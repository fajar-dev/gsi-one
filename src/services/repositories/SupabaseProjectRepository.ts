import {
    Project,
    ProjectDetail,
    ProjectFileType,
    ProjectStageStatus,
} from '../projectService';
import { IProjectRepository, UserOptionDto, PaginationOptions } from './IProjectRepository';
import { projectQueryRepository } from './sub/ProjectQueryRepository';
import { projectStageRepository } from './sub/ProjectStageRepository';
import { projectFileRepository } from './sub/ProjectFileRepository';
import { projectCommandRepository } from './sub/ProjectCommandRepository';

export class SupabaseProjectRepository implements IProjectRepository {
    public async getProjects(userId?: string, role?: string, options?: PaginationOptions): Promise<Project[]> {
        return projectQueryRepository.getProjects(userId, role, options);
    }

    public async getProjectDetail(projectId: string, role?: string): Promise<ProjectDetail> {
        return projectQueryRepository.getProjectDetail(projectId, role);
    }

    public async updateStageStatus(stageId: string, status: ProjectStageStatus, userId: string): Promise<void> {
        return projectStageRepository.updateStageStatus(stageId, status, userId);
    }

    public async addStageUpdate(stageId: string, description: string, progress: number, userId: string): Promise<void> {
        return projectStageRepository.addStageUpdate(stageId, description, progress, userId);
    }

    public async uploadFile(
        projectId: string,
        stageId: string | null,
        fileName: string,
        fileType: ProjectFileType,
        userId: string,
        fileUri?: string
    ): Promise<void> {
        return projectFileRepository.uploadFile(projectId, stageId, fileName, fileType, userId, fileUri);
    }

    public async createProject(project: Omit<Project, 'id' | 'created_at' | 'status'>, userId: string): Promise<void> {
        return projectCommandRepository.createProject(project, userId);
    }

    public async createProjectStage(projectId: string, title: string, description: string, userId: string): Promise<void> {
        return projectStageRepository.createProjectStage(projectId, title, description, userId);
    }

    public async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
        return projectCommandRepository.updateProject(projectId, updates);
    }

    public async updateProjectStage(stageId: string, updates: { title: string; description: string }): Promise<void> {
        return projectStageRepository.updateProjectStage(stageId, updates);
    }

    public async deleteProject(projectId: string): Promise<void> {
        return projectCommandRepository.deleteProject(projectId);
    }

    public async deleteProjectStage(stageId: string): Promise<void> {
        return projectStageRepository.deleteProjectStage(stageId);
    }

    public async getUsersByRole(role: string): Promise<UserOptionDto[]> {
        return projectCommandRepository.getUsersByRole(role);
    }
}
