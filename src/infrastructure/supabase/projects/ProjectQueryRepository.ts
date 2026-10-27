import { supabase } from '../../../config/supabase';
import type {
  Project,
  ProjectDetail,
  ProjectStage,
} from '../../../domain/models/project';
import { PaginationOptions } from '../../../domain/repositories/IProjectRepository';
import {
  ProjectRow,
  ProjectStageRow,
  StageUpdateRow,
  ProjectFileRow,
} from '../../../types/database.types';
import { projectMapper } from '../mappers/projectMapper';

export class ProjectQueryRepository {
  public async getProjects(
    userId?: string,
    role?: string,
    options?: PaginationOptions,
  ): Promise<Project[]> {
    let selectFields = '*';
    if (role === 'client') {
      selectFields =
        'id, project_code, project_name, client_name, start_date, estimated_finish, status, created_by, created_at';
    }

    let query = supabase.from('projects_with_budget').select(selectFields);

    if (role === 'client') {
      if (userId) {
        query = query.or(`client_id.eq.${userId},created_by.eq.${userId}`);
      }
    } else if (role === 'marketing') {
      if (userId) {
        query = query.or(`marketing_id.eq.${userId},created_by.eq.${userId}`);
      }
    } else if (role === 'engineer') {
      if (userId) {
        query = query.or(`engineer_id.eq.${userId},created_by.eq.${userId}`);
      }
    }

    query = query.order('created_at', { ascending: false });

    if (options && options.limit) {
      const offset = options.offset || 0;
      query = query.range(offset, offset + options.limit - 1);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message || 'Gagal memuat daftar proyek');
    }

    return projectMapper.mapProjectRowsToEntities(
      (data || []) as Partial<ProjectRow>[],
    );
  }

  public async getProjectDetail(
    projectId: string,
    role?: string,
  ): Promise<ProjectDetail> {
    const isClient = role === 'client';

    let selectFields = '*';
    if (isClient) {
      selectFields =
        'id, project_name, client_name, start_date, estimated_finish, status, created_by, created_at';
    }

    const { data: projectData, error: projectError } = await supabase
      .from('projects_with_budget')
      .select(selectFields)
      .eq('id', projectId)
      .single();

    if (projectError || !projectData) {
      throw new Error(projectError?.message || 'Proyek tidak ditemukan');
    }

    const { data: stagesData, error: stagesError } = await supabase
      .from('project_stages')
      .select('*')
      .eq('project_id', projectId)
      .order('sequence', { ascending: true });

    if (stagesError) {
      throw new Error(stagesError.message || 'Gagal memuat tahapan proyek');
    }

    const [updatesRes, filesRes] = await Promise.all([
      supabase
        .from('stage_updates')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
      supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false }),
    ]);
    if (updatesRes.error) throw new Error(updatesRes.error.message);
    if (filesRes.error) throw new Error(filesRes.error.message);
    const updates = ((updatesRes.data || []) as StageUpdateRow[]).map(
      projectMapper.mapStageUpdateRowToEntity,
    );
    const files = ((filesRes.data || []) as ProjectFileRow[]).map(
      projectMapper.mapProjectFileRowToEntity,
    );
    const stages: ProjectStage[] = (
      (stagesData || []) as ProjectStageRow[]
    ).map(row => {
      const stage = projectMapper.mapStageRowToEntity(row);
      return {
        ...stage,
        updates: updates.filter(u => u.stage_id === stage.id),
        files: files.filter(f => f.stage_id === stage.id),
      };
    });
    return {
      ...projectMapper.mapProjectRowToEntity(
        projectData as Partial<ProjectRow>,
      ),
      stages,
      files: files.filter(f => !f.stage_id),
      updates: updates.filter(u => !u.stage_id),
    };
  }
}

export const projectQueryRepository = new ProjectQueryRepository();
