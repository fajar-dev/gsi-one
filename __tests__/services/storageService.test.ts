import { storageService } from '../../src/services/storageService';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
    supabase: {
        storage: {
            from: jest.fn(),
        },
    },
}));

describe('storageService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('harus mengembalikan signedUrl ketika Supabase storage berhasil', async () => {
        const mockCreateSignedUrl = jest.fn().mockResolvedValue({
            data: { signedUrl: 'https://supabase.example.com/projects/123/doc.pdf?token=abc' },
            error: null,
        });

        (supabase.storage.from as jest.Mock).mockReturnValue({
            createSignedUrl: mockCreateSignedUrl,
        });

        const result = await storageService.getSignedUrl('123/doc.pdf', 3600);

        expect(supabase.storage.from).toHaveBeenCalledWith('projects');
        expect(mockCreateSignedUrl).toHaveBeenCalledWith('123/doc.pdf', 3600);
        expect(result.signedUrl).toBe('https://supabase.example.com/projects/123/doc.pdf?token=abc');
        expect(result.error).toBeNull();
    });

    it('harus mengembalikan error ketika Supabase storage mengalami kesalahan', async () => {
        const mockCreateSignedUrl = jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Object not found' },
        });

        (supabase.storage.from as jest.Mock).mockReturnValue({
            createSignedUrl: mockCreateSignedUrl,
        });

        const result = await storageService.getSignedUrl('123/invalid.pdf');

        expect(result.signedUrl).toBeNull();
        expect(result.error).toBe('Object not found');
    });
});
