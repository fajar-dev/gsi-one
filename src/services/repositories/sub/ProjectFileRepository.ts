import { supabase } from '../../../config/supabase';
import { ProjectFileType } from '../../projectService';
import { notificationService } from '../../notificationService';

export class ProjectFileRepository {
    public async uploadFile(
        projectId: string,
        stageId: string | null,
        fileName: string,
        fileType: ProjectFileType,
        userId: string,
        fileUri?: string
    ): Promise<void> {
        const fileExt = fileName.split('.').pop() || 'bin';
        const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const storagePath = `${projectId}/${cleanFileName}`;

        if (!fileUri) {
            throw new Error('Berkas yang akan diunggah tidak memiliki URI lokal. Metadata file tidak disimpan.');
        }

        let fileBody: ArrayBuffer;
        try {
            if (fileUri.startsWith('data:')) {
                fileBody = this.dataUriToArrayBuffer(fileUri);
            } else {
                const fetchResponse = await fetch(fileUri);
                if (!fetchResponse.ok) {
                    throw new Error(`HTTP ${fetchResponse.status} saat membaca berkas`);
                }
                fileBody = await fetchResponse.arrayBuffer();
            }

            const size = fileBody.byteLength;
            if (__DEV__) {
                console.log('[UPLOAD DEBUG] file size:', size, 'uri scheme:', fileUri.split(':')[0]);
            }

            if (size === 0) {
                throw new Error('Berkas kosong (0 bytes) - gagal membaca konten dari URI lokal');
            }
        } catch (fetchErr) {
            throw new Error(`Gagal membaca berkas lokal: ${fetchErr instanceof Error ? fetchErr.message : 'Unknown error'}`);
        }

        if (__DEV__) {
            console.log('[UPLOAD DEBUG] uploading to path:', storagePath, 'bucket: projects');
        }

        const { data: uploadData, error: uploadErr } = await supabase.storage
            .from('projects')
            .upload(storagePath, fileBody, {
                contentType: this.getMimeType(fileExt),
                upsert: true,
            });

        if (__DEV__) {
            console.log('[UPLOAD DEBUG] upload result - data:', JSON.stringify(uploadData), 'error:', uploadErr?.message);
        }

        if (uploadErr) {
            throw new Error(`Gagal mengunggah berkas ke storage: ${uploadErr.message}`);
        }


        const publicUrlData = supabase.storage
            .from('projects')
            .getPublicUrl(storagePath);

        const fileUrl = publicUrlData.data.publicUrl;

        const { error: dbError } = await supabase
            .from('project_files')
            .insert([
                {
                    project_id: projectId,
                    stage_id: stageId || null,
                    file_name: fileName,
                    file_url: fileUrl,
                    file_type: fileType,
                    uploaded_by: userId,
                },
            ]);

        if (dbError) {
            throw new Error(dbError.message || 'Gagal mencatat metadata berkas ke database');
        }

        try {
            const { data: projData } = await supabase
                .from('projects')
                .select('project_name, client_id')
                .eq('id', projectId)
                .maybeSingle();

            const projName = projData?.project_name || 'Proyek';

            if (projData?.client_id) {
                notificationService.createNotification({
                    userId: projData.client_id,
                    title: 'Dokumen Baru Diunggah',
                    message: `Dokumen "${fileName}" telah diunggah pada proyek "${projName}".`,
                    type: 'file_uploaded',
                    referenceId: projectId,
                });
            }

            notificationService.createNotification({
                targetRole: 'marketing',
                title: 'Update Dokumentasi Proyek',
                message: `Dokumen "${fileName}" diunggah pada proyek "${projName}".`,
                type: 'file_uploaded',
                referenceId: projectId,
            });
        } catch (notifErr) {
            if (__DEV__) { console.warn('[NOTIFICATION ERROR] uploadFile:', notifErr instanceof Error ? notifErr.message : notifErr); }
        }
    }

    public getMimeType(ext: string): string {
        const map: Record<string, string> = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            webp: 'image/webp',
            pdf: 'application/pdf',
            doc: 'application/msword',
            docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            xls: 'application/vnd.ms-excel',
            xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            mp4: 'video/mp4',
        };
        return map[ext.toLowerCase()] || 'application/octet-stream';
    }

    private dataUriToArrayBuffer(dataUri: string): ArrayBuffer {
        const base64 = dataUri.substring(dataUri.indexOf(',') + 1).replace(/\s/g, '');
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
        const bytes = new Uint8Array((base64.length * 3) / 4 - padding);
        let byteIndex = 0;

        for (let index = 0; index < base64.length; index += 4) {
            const first = alphabet.indexOf(base64[index]);
            const second = alphabet.indexOf(base64[index + 1]);
            const third = base64[index + 2] === '=' ? 0 : alphabet.indexOf(base64[index + 2]);
            const fourth = base64[index + 3] === '=' ? 0 : alphabet.indexOf(base64[index + 3]);

            if (first < 0 || second < 0 || third < 0 || fourth < 0) {
                throw new Error('Format Base64 foto tidak valid');
            }

            bytes[byteIndex++] = first * 4 + Math.floor(second / 16);
            if (base64[index + 2] !== '=') {
                bytes[byteIndex++] = (second % 16) * 16 + Math.floor(third / 4);
            }
            if (base64[index + 3] !== '=') {
                bytes[byteIndex++] = (third % 4) * 64 + fourth;
            }
        }

        return bytes.buffer;
    }
}

export const projectFileRepository = new ProjectFileRepository();
