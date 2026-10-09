import { supabase } from '../../../config/supabase';
import { ProjectStageStatus } from '../../projectService';
import { notificationService } from '../../notificationService';

export class ProjectStageRepository {
    public async updateStageStatus(stageId: string, status: ProjectStageStatus, userId: string): Promise<void> {
        const { data: updated, error: stageError } = await supabase
            .from('project_stages')
            .update({
                status,
                updated_by: userId,
                updated_at: new Date().toISOString(),
            })
            .eq('id', stageId)
            .select('id');

        if (stageError) {
            throw new Error(stageError.message || 'Gagal memperbarui status tahapan');
        }

        // RLS yang menyaring baris tidak menghasilkan error, hanya 0 baris -- karena
        // itu setiap UPDATE/DELETE di file ini memakai .select('id') dan memeriksa hasil.
        if (!updated || updated.length === 0) {
            throw new Error('Status tahapan tidak tersimpan: akses ditolak atau tahapan tidak ditemukan.');
        }

        try {
            const { data: stageData } = await supabase
                .from('project_stages')
                .select('title, project_id')
                .eq('id', stageId)
                .maybeSingle();

            if (stageData) {
                const { data: projData } = await supabase
                    .from('projects')
                    .select('project_name, client_id')
                    .eq('id', stageData.project_id)
                    .maybeSingle();

                const projName = projData?.project_name || 'Proyek';
                const stageTitle = stageData.title || 'Tahapan';

                if (projData?.client_id) {
                    notificationService.createNotification({
                        userId: projData.client_id,
                        title: 'Update Tahapan Proyek',
                        message: `Tahapan "${stageTitle}" pada proyek "${projName}" diubah menjadi ${status}.`,
                        type: 'stage_updated',
                        referenceId: stageData.project_id,
                    });
                }

                notificationService.createNotification({
                    targetRole: 'marketing',
                    title: 'Pembaruan Tahapan Proyek',
                    message: `Tahapan "${stageTitle}" proyek "${projName}" diperbarui (${status}).`,
                    type: 'stage_updated',
                    referenceId: stageData.project_id,
                });

                const { data: userProfile } = await supabase
                    .from('users')
                    .select('role, name')
                    .eq('id', userId)
                    .maybeSingle();

                if (userProfile?.role === 'engineer') {
                    notificationService.createNotification({
                        targetRole: 'admin',
                        title: 'Update Tahapan oleh Engineer',
                        message: `Engineer ${userProfile.name || ''} memperbarui tahapan "${stageTitle}" proyek "${projName}".`,
                        type: 'stage_updated',
                        referenceId: stageData.project_id,
                    });
                }
            }
        } catch (notifErr) {
            if (__DEV__) { console.warn('[NOTIFICATION ERROR] updateStageStatus:', notifErr instanceof Error ? notifErr.message : notifErr); }
        }
    }

    public async addStageUpdate(stageId: string, description: string, progress: number, userId: string): Promise<void> {
        const { error } = await supabase
            .from('stage_updates')
            .insert([
                {
                    stage_id: stageId,
                    description: description.trim(),
                    progress: progress || null,
                    created_by: userId,
                },
            ]);

        if (error) {
            throw new Error(error.message || 'Gagal menambahkan catatan progres');
        }

        try {
            const { data: stageData } = await supabase
                .from('project_stages')
                .select('title, project_id')
                .eq('id', stageId)
                .maybeSingle();

            if (stageData) {
                const { data: projData } = await supabase
                    .from('projects')
                    .select('project_name, client_id')
                    .eq('id', stageData.project_id)
                    .maybeSingle();

                const projName = projData?.project_name || 'Proyek';

                if (projData?.client_id) {
                    notificationService.createNotification({
                        userId: projData.client_id,
                        title: 'Catatan Progres Baru',
                        message: `Ada catatan progres baru pada proyek "${projName}": ${description.substring(0, 40)}...`,
                        type: 'stage_updated',
                        referenceId: stageData.project_id,
                    });
                }

                notificationService.createNotification({
                    targetRole: 'marketing',
                    title: 'Progres Proyek Baru',
                    message: `Progres proyek "${projName}" diperbarui: ${description.substring(0, 40)}...`,
                    type: 'stage_updated',
                    referenceId: stageData.project_id,
                });

                const { data: userProfile } = await supabase
                    .from('users')
                    .select('role, name')
                    .eq('id', userId)
                    .maybeSingle();

                if (userProfile?.role === 'engineer') {
                    notificationService.createNotification({
                        targetRole: 'admin',
                        title: 'Update Progres oleh Engineer',
                        message: `Engineer ${userProfile.name || ''} menambahkan catatan progres pada proyek "${projName}".`,
                        type: 'stage_updated',
                        referenceId: stageData.project_id,
                    });
                }
            }
        } catch (notifErr) {
            if (__DEV__) { console.warn('[NOTIFICATION ERROR] addStageUpdate:', notifErr instanceof Error ? notifErr.message : notifErr); }
        }
    }

    public async createProjectStage(projectId: string, title: string, description: string, userId: string): Promise<void> {
        const { data: allStages, error: stagesError } = await supabase
            .from('project_stages')
            .select('sequence')
            .eq('project_id', projectId);

        if (stagesError) {
            throw new Error(stagesError.message || 'Gagal menghitung urutan tahapan');
        }

        const maxSequence = (allStages || []).reduce(
            (max, s) => Math.max(max, Number(s.sequence) || 0),
            0,
        );
        const nextSequence = maxSequence + 1;

        const { error } = await supabase
            .from('project_stages')
            .insert([
                {
                    project_id: projectId,
                    title: title.trim(),
                    description: description.trim() || null,
                    sequence: nextSequence,
                    status: 'pending',
                    updated_by: userId,
                },
            ]);

        if (error) {
            throw new Error(error.message || 'Gagal menambahkan tahapan baru');
        }

        const { data: projectData } = await supabase
            .from('projects')
            .select('status, project_name, client_id')
            .eq('id', projectId)
            .single();

        if (projectData && projectData.status === 'done') {
            await supabase
                .from('projects')
                .update({ status: 'on_progress' })
                .eq('id', projectId);
        }

        if (projectData) {
            if (projectData.client_id) {
                notificationService.createNotification({
                    userId: projectData.client_id,
                    title: 'Tahapan Proyek Baru',
                    message: `Tahapan "${title}" ditambahkan pada proyek "${projectData.project_name}".`,
                    type: 'stage_updated',
                    referenceId: projectId,
                });
            }

            notificationService.createNotification({
                targetRole: 'marketing',
                title: 'Tahapan Proyek Baru',
                message: `Tahapan "${title}" ditambahkan pada proyek "${projectData.project_name}".`,
                type: 'stage_updated',
                referenceId: projectId,
            });
        }
    }

    public async updateProjectStage(stageId: string, updates: { title: string; description: string }): Promise<void> {
        const { data: updated, error } = await supabase
            .from('project_stages')
            .update({
                title: updates.title.trim(),
                description: updates.description.trim() || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', stageId)
            .select('id');

        if (error) {
            throw new Error(error.message || 'Gagal memperbarui tahapan proyek');
        }

        if (!updated || updated.length === 0) {
            throw new Error('Tahapan tidak tersimpan: akses ditolak atau tahapan tidak ditemukan.');
        }
    }

    public async deleteProjectStage(stageId: string): Promise<void> {
        const { data: deleted, error } = await supabase
            .from('project_stages')
            .delete()
            .eq('id', stageId)
            .select('id');

        if (error) {
            throw new Error(error.message || 'Gagal menghapus tahapan proyek');
        }

        if (!deleted || deleted.length === 0) {
            throw new Error('Tahapan tidak terhapus: akses ditolak atau tahapan tidak ditemukan.');
        }
    }
}

export const projectStageRepository = new ProjectStageRepository();
