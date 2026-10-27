import { parseUrl } from '../utils/url';
import { supabase } from '../config/supabase';

export interface SignedUrlResult {
    signedUrl: string | null;
    error: string | null;
}

export const storageService = {
    projectFilePath: (value: string): string | null => {
        if (!value) return null;
        if (!value.includes('://')) return value.startsWith('/') || value.includes('..') ? null : value;
        try {
            const url = parseUrl(value);
            const match = url.pathname.match(/^\/storage\/v1\/object\/(?:public|sign|authenticated)\/projects\/(.+)$/);
            return match ? decodeURIComponent(match[1]) : null;
        } catch { return null; }
    },
    openProjectFile: async (value: string): Promise<string> => {
        const path = storageService.projectFilePath(value);
        if (!path) throw new Error('Lokasi berkas tidak valid. Hubungi administrator.');
        const result = await storageService.getSignedUrl(path, 300);
        if (!result.signedUrl) throw new Error(result.error || 'Berkas tidak dapat diakses.');
        return result.signedUrl;
    },
    removeProjectFiles: async (projectId: string): Promise<void> => {
        const bucket = supabase.storage.from('projects');
        const paths: string[] = [];
        const collect = async (prefix: string, depth = 0): Promise<void> => {
            if (depth > 32) throw new Error('Folder berkas terlalu dalam.');
            for (let offset = 0; ; offset += 1000) {
                const { data, error } = await bucket.list(prefix, { limit: 1000, offset });
                if (error) throw new Error(error.message);
                for (const file of data || []) {
                    if (file.id) paths.push(`${prefix}/${file.name}`);
                    else await collect(`${prefix}/${file.name}`, depth + 1);
                }
                if (!data || data.length < 1000) break;
            }
        };
        await collect(projectId);
        for (let i = 0; i < paths.length; i += 100) {
            const { error } = await bucket.remove(paths.slice(i, i + 100));
            if (error) throw new Error(`Berkas belum terhapus: ${error.message}. Silakan coba lagi.`);
        }
    },
    getSignedUrl: async (
        path: string,
        expiresInSeconds: number = 3600,
        bucket: string = 'projects'
    ): Promise<SignedUrlResult> => {
        try {
            const { data, error } = await supabase.storage
                .from(bucket)
                .createSignedUrl(path, expiresInSeconds);

            if (error || !data) {
                return {
                    signedUrl: null,
                    error: error?.message || 'Gagal membuat Signed URL',
                };
            }

            return {
                signedUrl: data.signedUrl,
                error: null,
            };
        } catch (err: unknown) {
            return {
                signedUrl: null,
                error: err instanceof Error ? err.message : 'Terjadi kesalahan pada layanan storage',
            };
        }
    },
};
