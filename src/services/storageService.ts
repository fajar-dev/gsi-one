import { supabase } from '../config/supabase';

export interface SignedUrlResult {
    signedUrl: string | null;
    error: string | null;
}

export const storageService = {
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
