import { supabase } from '../../../config/supabase';
import type { ProjectStageStatus } from '../../../domain/models/project';

export class ProjectStageRepository {
  public async updateStageStatus(
    stageId: string,
    status: ProjectStageStatus,
    userId: string,
  ): Promise<void> {
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
      throw new Error(
        'Status tahapan tidak tersimpan: akses ditolak atau tahapan tidak ditemukan.',
      );
    }
  }

  public async addStageUpdate(
    stageId: string,
    description: string,
    progress: number,
    userId: string,
  ): Promise<void> {
    const { error } = await supabase.from('stage_updates').insert([
      {
        stage_id: stageId,
        description: description.trim(),
        progress: progress ?? null,
        created_by: userId,
      },
    ]);

    if (error) {
      throw new Error(error.message || 'Gagal menambahkan catatan progres');
    }
  }

  public async createProjectStage(
    projectId: string,
    title: string,
    description: string,
    userId: string,
  ): Promise<void> {
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

    const { error } = await supabase.from('project_stages').insert([
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
  }

  public async updateProjectStage(
    stageId: string,
    updates: { title: string; description: string },
  ): Promise<void> {
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
      throw new Error(
        'Tahapan tidak tersimpan: akses ditolak atau tahapan tidak ditemukan.',
      );
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
      throw new Error(
        'Tahapan tidak terhapus: akses ditolak atau tahapan tidak ditemukan.',
      );
    }
  }
}

export const projectStageRepository = new ProjectStageRepository();
