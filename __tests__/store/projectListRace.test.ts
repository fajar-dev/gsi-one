import { useProjectStore } from '../../src/store/projectStore';
import { projectService } from '../../src/services/projectService';
jest.mock('../../src/services/projectService', () => ({
  projectService: { getProjects: jest.fn() },
}));
let mockUserId = 'one';
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: {
    getState: () => ({ user: { id: mockUserId, role: 'admin' } }),
  },
}));
describe('project list request ownership', () => {
  beforeEach(() => {
    mockUserId = 'one';
    jest.clearAllMocks();
    useProjectStore.setState({
      projects: [],
      listRequestId: 0,
      error: null,
      isLoading: false,
    });
  });
  it('keeps the newest list when an older response finishes last', async () => {
    let resolveOld!: (value: unknown) => void;
    (projectService.getProjects as jest.Mock)
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveOld = resolve;
        }),
      )
      .mockResolvedValueOnce([{ id: 'new', status: 'pending' }]);
    const first = useProjectStore.getState().fetchProjects();
    await useProjectStore.getState().fetchProjects();
    resolveOld([{ id: 'old', status: 'done' }]);
    await first;
    expect(useProjectStore.getState().projects.map(p => p.id)).toEqual(['new']);
  });
  it('does not publish an error belonging to a signed-out account', async () => {
    let reject!: (error: Error) => void;
    (projectService.getProjects as jest.Mock).mockReturnValue(
      new Promise((_, r) => {
        reject = r;
      }),
    );
    const pending = useProjectStore.getState().fetchProjects();
    mockUserId = 'two';
    useProjectStore.setState({ error: null, isLoading: false });
    reject(new Error('Old account failure'));
    await pending;
    expect(useProjectStore.getState().error).toBeNull();
  });
});
