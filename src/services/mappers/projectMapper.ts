import { ProjectRow, ProjectStageRow, StageUpdateRow, ProjectFileRow } from '../../types/database.types';
import { Project, ProjectStage, StageUpdate, ProjectFile, ProjectStatus, ProjectStageStatus, ProjectFileType } from '../projectService';

export const projectMapper = {
  mapProjectRowToEntity: (row: Partial<ProjectRow>): Project => {
    return {
      id: String(row.id || ''),
      project_code: row.project_code || undefined,
      project_name: row.project_name || '',
      client_name: row.client_name || '',
      budget: row.budget !== null && row.budget !== undefined ? Number(row.budget) : undefined,
      start_date: row.start_date || '',
      estimated_finish: row.estimated_finish || '',
      status: (row.status as ProjectStatus) || 'pending',
      created_by: row.created_by || '',
      client_id: row.client_id || undefined,
      marketing_id: row.marketing_id || undefined,
      engineer_id: row.engineer_id || undefined,
      created_at: row.created_at || new Date().toISOString(),
    };
  },

  mapProjectRowsToEntities: (rows: Partial<ProjectRow>[]): Project[] => {
    return (rows || []).map((row) => projectMapper.mapProjectRowToEntity(row));
  },

  mapStageRowToEntity: (row: Partial<ProjectStageRow>): ProjectStage => {
    return {
      id: String(row.id || ''),
      project_id: String(row.project_id || ''),
      title: row.title || '',
      description: row.description || '',
      sequence: Number(row.sequence || 1),
      status: (row.status as ProjectStageStatus) || 'pending',
      updated_by: row.updated_by || '',
      updated_at: row.updated_at || new Date().toISOString(),
    };
  },

  mapStageUpdateRowToEntity: (row: Partial<StageUpdateRow>): StageUpdate => {
    return {
      id: String(row.id || ''),
      stage_id: row.stage_id ? String(row.stage_id) : null,
      description: row.description || '',
      progress: Number(row.progress || 0),
      created_by: row.created_by || '',
      created_at: row.created_at || new Date().toISOString(),
    };
  },

  mapProjectFileRowToEntity: (row: Partial<ProjectFileRow>): ProjectFile => {
    return {
      id: String(row.id || ''),
      project_id: String(row.project_id || ''),
      stage_id: row.stage_id ? String(row.stage_id) : null,
      file_name: row.file_name || '',
      file_url: row.file_url || '',
      file_type: (row.file_type as ProjectFileType) || 'other',
      uploaded_by: row.uploaded_by || '',
      created_at: row.created_at || new Date().toISOString(),
    };
  },
};
