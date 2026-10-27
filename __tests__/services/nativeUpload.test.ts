import { ProjectFileRepository } from '../../src/services/repositories/sub/ProjectFileRepository';
import { supabase } from '../../src/config/supabase';
jest.mock('../../src/config/supabase', () => ({ supabase: { storage: { from: jest.fn() }, from: jest.fn() } }));
const formDataHost = globalThis as unknown as { FormData: typeof FormData };
const originalFormData = formDataHost.FormData;
beforeAll(() => { formDataHost.FormData = jest.requireActual('react-native/Libraries/Network/FormData').default; });
afterAll(() => { formDataHost.FormData = originalFormData; });
it('uploads local documents with the native transport and removes the object if metadata fails', async () => {
  const upload = jest.fn().mockResolvedValue({ data: { path: '5/test.pdf' }, error: null });
  const remove = jest.fn().mockResolvedValue({ data: [], error: null });
  (supabase.storage.from as jest.Mock).mockReturnValue({ upload, remove });
  (supabase.from as jest.Mock).mockReturnValue({ insert: jest.fn().mockResolvedValue({ error: { message: 'Database unavailable' } }) });
  await expect(new ProjectFileRepository().uploadFile('5', '8', 'test.pdf', 'report', 'admin', 'file:///cache/test.pdf')).rejects.toThrow('Database unavailable');
  const form = upload.mock.calls[0][1] as FormData & { has: (key: string) => boolean; getAll: (key: string) => unknown[] };
  expect(form.has('file')).toBe(true);
  expect(form.getAll('file')).toEqual([{ uri: 'file:///cache/test.pdf', name: 'test.pdf', type: 'application/pdf' }]);
  expect(remove).toHaveBeenCalledWith([expect.stringMatching(/^5\/.+\.pdf$/)]);
});
