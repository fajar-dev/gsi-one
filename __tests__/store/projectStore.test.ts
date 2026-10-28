import { useProjectStore } from '../../src/store/projectStore';
import type { ProjectDetail } from '../../src/domain/models/project';
import { projectService } from '../../src/services/projectService';
jest.mock('../../src/services/projectService', () => ({
  projectService: { getProjectDetail: jest.fn() },
}));
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: { getState: () => ({ user: { id: 'admin', role: 'admin' } }) },
}));
describe('project detail isolation', () => {
  beforeEach(() => {
    useProjectStore.setState({
      selectedProject: null,
      detailRequestId: 0,
      error: null,
    });
  });
  it('clears previous project when a later request fails', async () => {
    (projectService.getProjectDetail as jest.Mock)
      .mockResolvedValueOnce({ id: '1', stages: [] })
      .mockRejectedValueOnce(new Error('Not found'));
    await useProjectStore.getState().fetchProjectDetail('1');
    await useProjectStore.getState().fetchProjectDetail('missing');
    expect(useProjectStore.getState().selectedProject).toBeNull();
    expect(useProjectStore.getState().error).toBe('Not found');
  });
  it('ignores an older response that arrives after a new project', async () => {
    let resolveOld!: (value: unknown) => void;
    (projectService.getProjectDetail as jest.Mock)
      .mockReturnValueOnce(
        new Promise(resolve => {
          resolveOld = resolve;
        }),
      )
      .mockResolvedValueOnce({ id: '2', stages: [] });
    const old = useProjectStore.getState().fetchProjectDetail('1');
    await useProjectStore.getState().fetchProjectDetail('2');
    resolveOld({ id: '1', stages: [] });
    await old;
    expect(useProjectStore.getState().selectedProject?.id).toBe('2');
  });
});

it('retains an already displayed detail when its background refresh fails', async () => {
  let reject!: (error: Error) => void;
  useProjectStore.setState({
    selectedProject: {
      id: '1',
      project_name: 'One',
      client_name: 'Client',
      created_by: 'admin',
      created_at: '',
      start_date: '',
      estimated_finish: '',
      status: 'pending',
      stages: [],
    } satisfies ProjectDetail,
  });
  jest.mocked(projectService.getProjectDetail).mockReturnValueOnce(
    new Promise((_, rejectRequest) => {
      reject = rejectRequest;
    }),
  );
  const refresh = useProjectStore.getState().fetchProjectDetail('1');
  expect(useProjectStore.getState().selectedProject?.id).toBe('1');
  reject(new Error('Network unavailable'));
  await refresh;
  expect(useProjectStore.getState()).toMatchObject({
    selectedProject: { id: '1' },
    isLoadingDetail: false,
    error: 'Network unavailable',
  });
});
