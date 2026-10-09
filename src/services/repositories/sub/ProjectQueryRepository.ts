import { supabase } from '../../../config/supabase';
import { Project, ProjectDetail, ProjectStage } from '../../projectService';
import { PaginationOptions } from '../IProjectRepository';
import { ProjectRow } from '../../../types/database.types';
import { projectMapper } from '../../mappers/projectMapper';

export class ProjectQueryRepository {
    public async getProjects(userId?: string, role?: string, options?: PaginationOptions): Promise<Project[]> {
        let selectFields = '*';
        if (role === 'client') {
            selectFields = 'id, project_code, project_name, client_name, start_date, estimated_finish, status, created_by, created_at';
        }

        let query = supabase.from('projects').select(selectFields);

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

        return projectMapper.mapProjectRowsToEntities((data || []) as Partial<ProjectRow>[]);
    }

    public async getProjectDetail(projectId: string, role?: string): Promise<ProjectDetail> {
        const isClient = role === 'client';

        let selectFields = '*';
        if (isClient) {
            selectFields = 'id, project_name, client_name, start_date, estimated_finish, status, created_by, created_at';
        }

        const { data: projectData, error: projectError } = await supabase
            .from('projects')
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

        const stages: ProjectStage[] = [];
        const stageIds = (stagesData || []).map(s => s.id);

        let allUpdates: Record<string, unknown>[] = [];
        let allFiles: Record<string, unknown>[] = [];

        if (stageIds.length > 0) {
            const [updatesRes, filesRes] = await Promise.all([
                supabase
                    .from('stage_updates')
                    .select('*')
                    .in('stage_id', stageIds)
                    .order('created_at', { ascending: false }),
                supabase
                    .from('project_files')
                    .select('*')
                    .in('stage_id', stageIds)
                    .order('created_at', { ascending: false }),
            ]);
            // Tanpa ini, query yang gagal tampil sebagai "belum ada catatan/berkas".
            if (updatesRes.error) {
                throw new Error(updatesRes.error.message || 'Gagal memuat catatan progres tahapan');
            }
            if (filesRes.error) {
                throw new Error(filesRes.error.message || 'Gagal memuat berkas tahapan');
            }

            allUpdates = (updatesRes.data || []) as Record<string, unknown>[];
            allFiles = (filesRes.data || []) as Record<string, unknown>[];
        }

        for (const stage of (stagesData || [])) {
            stages.push({
                ...stage,
                updates: allUpdates.filter((u: Record<string, unknown>) => u.stage_id === stage.id) || [],
                files: allFiles.filter((f: Record<string, unknown>) => f.stage_id === stage.id) || [],
            });
        }

        return {
            ...((projectData as unknown as ProjectRow) as unknown as Project),
            stages,
        } as ProjectDetail;
    }
}

export const projectQueryRepository = new ProjectQueryRepository();
