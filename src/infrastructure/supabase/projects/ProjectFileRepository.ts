import { supabase } from '../../../config/supabase';
import type { ProjectFileType } from '../../../domain/models/project';

export class ProjectFileRepository {
  public async uploadFile(
    projectId: string,
    stageId: string | null,
    fileName: string,
    fileType: ProjectFileType,
    userId: string,
    fileUri?: string,
  ): Promise<void> {
    const fileExt = fileName.split('.').pop() || 'bin';
    const cleanFileName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;
    const storagePath = `${projectId}/${cleanFileName}`;

    if (!fileUri) {
      throw new Error(
        'Berkas yang akan diunggah tidak memiliki URI lokal. Metadata file tidak disimpan.',
      );
    }

    let fileBody: ArrayBuffer | FormData;
    try {
      if (/^(file|content):/.test(fileUri)) {
        // RN sends local URIs through its native multipart transport.
        // storage-js requires has(), which RN FormData does not implement.
        const body = new FormData() as FormData & {
          has?: (name: string) => boolean;
          getAll: (name: string) => unknown[];
        };
        (
          body as unknown as {
            append(
              name: string,
              file: { uri: string; name: string; type: string },
            ): void;
          }
        ).append('file', {
          uri: fileUri,
          name: fileName,
          type: this.getMimeType(fileExt),
        });
        if (!body.has) body.has = name => body.getAll(name).length > 0;
        fileBody = body;
      } else if (fileUri.startsWith('data:')) {
        fileBody = this.dataUriToArrayBuffer(fileUri);
      } else {
        const fetchResponse = await fetch(fileUri);
        if (!fetchResponse.ok) {
          throw new Error(`HTTP ${fetchResponse.status} saat membaca berkas`);
        }
        fileBody = await fetchResponse.arrayBuffer();
      }

      if (fileBody instanceof ArrayBuffer && fileBody.byteLength === 0) {
        throw new Error(
          'Berkas kosong (0 bytes) - gagal membaca konten dari URI lokal',
        );
      }
    } catch (fetchErr) {
      throw new Error(
        `Gagal membaca berkas lokal: ${
          fetchErr instanceof Error ? fetchErr.message : 'Unknown error'
        }`,
      );
    }

    const { error: uploadErr } = await supabase.storage
      .from('projects')
      .upload(storagePath, fileBody, {
        contentType: this.getMimeType(fileExt),
        upsert: true,
      });

    if (uploadErr) {
      throw new Error(
        `Gagal mengunggah berkas ke storage: ${uploadErr.message}`,
      );
    }

    const fileUrl = storagePath;

    const { error: dbError } = await supabase.from('project_files').insert([
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
      const { error: cleanupError } = await supabase.storage
        .from('projects')
        .remove([storagePath]);
      if (cleanupError) {
        throw new Error(
          `Metadata gagal disimpan dan berkas belum dibersihkan: ${dbError.message}. ${cleanupError.message}`,
        );
      }
      throw new Error(
        dbError.message || 'Gagal mencatat metadata berkas ke database',
      );
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
    const base64 = dataUri
      .substring(dataUri.indexOf(',') + 1)
      .replace(/\s/g, '');
    const alphabet =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
    const bytes = new Uint8Array((base64.length * 3) / 4 - padding);
    let byteIndex = 0;

    for (let index = 0; index < base64.length; index += 4) {
      const first = alphabet.indexOf(base64[index]);
      const second = alphabet.indexOf(base64[index + 1]);
      const third =
        base64[index + 2] === '=' ? 0 : alphabet.indexOf(base64[index + 2]);
      const fourth =
        base64[index + 3] === '=' ? 0 : alphabet.indexOf(base64[index + 3]);

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
