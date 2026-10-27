import { useAuthStore, invalidateAuthInitialization } from '../../src/store/authStore';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({ supabase: { auth: { getSession: jest.fn() }, from: jest.fn() } }));
jest.mock('../../src/services/authService', () => ({ authService: {}, normalizeAuthRole: (role: string) => role }));

const session = (id: string) => ({ data: { session: { user: { id, email: `${id}@example.com` }, access_token: id } } });
const profile = (name: string) => ({ data: { name, role: 'client' }, error: null });
describe('auth initialization race protection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    invalidateAuthInitialization();
    useAuthStore.setState({ user: null, token: null, isInitialized: false });
  });
  it('ignores an old profile after a newer session has initialized', async () => {
    let resolveOld!: (value: unknown) => void;
    const oldProfile = new Promise(resolve => { resolveOld = resolve; });
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce(session('old')).mockResolvedValueOnce(session('new'));
    const maybeSingle = jest.fn().mockReturnValueOnce(oldProfile).mockResolvedValueOnce(profile('New Client'));
    (supabase.from as jest.Mock).mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle }) }) });
    const old = useAuthStore.getState().initialize();
    await Promise.resolve();
    await useAuthStore.getState().initialize();
    resolveOld(profile('Old Client'));
    await old;
    expect(useAuthStore.getState().user?.id).toBe('new');
  });
  it('does not restore a profile after the signed-out event invalidates initialization', async () => {
    let resolveProfile!: (value: unknown) => void;
    (supabase.auth.getSession as jest.Mock).mockResolvedValue(session('old'));
    (supabase.from as jest.Mock).mockReturnValue({ select: () => ({ eq: () => ({ maybeSingle: () => new Promise(resolve => { resolveProfile = resolve; }) }) }) });
    const pending = useAuthStore.getState().initialize();
    await Promise.resolve();
    invalidateAuthInitialization();
    useAuthStore.setState({ user: null, token: null });
    resolveProfile(profile('Old Client'));
    await pending;
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
