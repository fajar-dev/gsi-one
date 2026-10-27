import { supabase } from '../../../config/supabase';
import { Project, ProjectUserRole } from '../../projectService';
import { UserOptionDto } from '../IProjectRepository';
import { storageService } from '../../storageService';

export class ProjectCommandRepository {
    public async createProject(project: Omit<Project, 'id' | 'created_at' | 'status'>, userId: string): Promise<void> {
        const { error } = await supabase
            .from('projects')
            .insert([
                {
                    ...project,
                    status: 'pending',
                    created_by: userId,
                },
            ])
            .select('id, project_name, client_id, engineer_id, marketing_id')
            .single();

        if (error) {
            throw new Error(error.message || 'Gagal membuat proyek baru');
        }

    }

    public async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
        const { data: updated, error } = await supabase
            .from('projects')
            .update({
                project_code: updates.project_code,
                project_name: updates.project_name,
                client_name: updates.client_name,
                budget: updates.budget,
                start_date: updates.start_date,
                estimated_finish: updates.estimated_finish,
                status: updates.status,
                client_id: updates.client_id,
                marketing_id: updates.marketing_id,
                engineer_id: updates.engineer_id,
            })
            .eq('id', projectId)
            .select('id');

        if (error) {
            throw new Error(error.message || 'Gagal memperbarui proyek');
        }

        // RLS yang menyaring baris tidak menghasilkan error, hanya 0 baris -- karena
        // itu setiap UPDATE/DELETE di file ini memakai .select('id') dan memeriksa hasil.
        if (!updated || updated.length === 0) {
            throw new Error('Proyek tidak tersimpan: akses ditolak atau proyek tidak ditemukan.');
        }
    }

    public async deleteProject(projectId: string): Promise<void> {
        const { data: role, error: roleError } = await supabase.rpc('get_my_role');
        if (roleError || !['admin', 'engineer'].includes(role)) {
            throw new Error('Hanya admin atau engineer yang dapat menghapus proyek.');
        }
        const { data: project, error: projectError } = await supabase.from('projects')
            .select('id, project_code').eq('id', projectId).single();
        if (projectError || !project) throw new Error('Proyek tidak ditemukan atau akses ditolak.');
        await storageService.removeProjectFiles(String(project.id));
        if (project.project_code && project.project_code !== String(project.id)) {
            await storageService.removeProjectFiles(project.project_code);
        }
        const { data: deleted, error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId)
            .select('id');

        if (error) {
            throw new Error(error.message || 'Gagal menghapus proyek');
        }

        if (!deleted || deleted.length === 0) {
            throw new Error('Proyek tidak terhapus: akses ditolak atau proyek tidak ditemukan.');
        }
    }

    public async getUsersByRole(role: string): Promise<UserOptionDto[]> {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('role', role as ProjectUserRole)
            .order('name', { ascending: true });

        if (error) {
            throw new Error(error.message || `Gagal mengambil daftar pengguna dengan role ${role}`);
        }

        return data || [];
    }
}

export const projectCommandRepository = new ProjectCommandRepository();
