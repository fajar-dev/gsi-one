import { supabase } from '../../../config/supabase';
import { Project, ProjectUserRole } from '../../projectService';
import { UserOptionDto } from '../IProjectRepository';
import { notificationService } from '../../notificationService';

export class ProjectCommandRepository {
    public async createProject(project: Omit<Project, 'id' | 'created_at' | 'status'>, userId: string): Promise<void> {
        const { data, error } = await supabase
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

        const projId = data?.id;
        const projName = project.project_name;

        if (project.client_id) {
            notificationService.createNotification({
                userId: project.client_id,
                title: 'Proyek Baru Ditambahkan',
                message: `Anda dimasukkan ke dalam proyek baru: "${projName}".`,
                type: 'project_created',
                referenceId: projId,
            });
        }

        if (project.engineer_id) {
            notificationService.createNotification({
                userId: project.engineer_id,
                title: 'Penugasan Proyek Baru',
                message: `Anda telah ditugaskan sebagai Engineer untuk proyek: "${projName}".`,
                type: 'engineer_assigned',
                referenceId: projId,
            });
        }

        notificationService.createNotification({
            targetRole: 'marketing',
            title: 'Proyek Baru Dibuat',
            message: `Proyek "${projName}" baru saja dibuat.`,
            type: 'project_created',
            referenceId: projId,
        });
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

        try {
            const { data: projData } = await supabase
                .from('projects')
                .select('project_name, client_id, engineer_id')
                .eq('id', projectId)
                .maybeSingle();

            const projName = projData?.project_name || updates.project_name || 'Proyek';

            if (projData?.client_id) {
                notificationService.createNotification({
                    userId: projData.client_id,
                    title: 'Pembaruan Proyek',
                    message: `Informasi proyek "${projName}" telah diperbarui.`,
                    type: 'project_updated',
                    referenceId: projectId,
                });
            }

            if (updates.engineer_id) {
                notificationService.createNotification({
                    userId: updates.engineer_id,
                    title: 'Penugasan Proyek',
                    message: `Anda ditugaskan ke dalam proyek: "${projName}".`,
                    type: 'engineer_assigned',
                    referenceId: projectId,
                });
            }

            notificationService.createNotification({
                targetRole: 'marketing',
                title: 'Perubahan Dalam Proyek',
                message: `Data proyek "${projName}" mengalami perubahan.`,
                type: 'project_updated',
                referenceId: projectId,
            });
        } catch (notifErr) {
            if (__DEV__) { console.warn('[NOTIFICATION ERROR] updateProject:', notifErr instanceof Error ? notifErr.message : notifErr); }
        }
    }

    public async deleteProject(projectId: string): Promise<void> {
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
