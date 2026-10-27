import { useProjectStore } from '../../src/store/projectStore';
import { projectService } from '../../src/services/projectService';
import type { ProjectDetail } from '../../src/domain/models/project';
import { deferred } from '../../test/helpers/deferred';
jest.mock('../../src/services/projectService', () => ({
  projectService: {
    updateStageStatus: jest.fn(),
    deleteProject: jest.fn(),
    getProjects: jest.fn(),
    getProjectDetail: jest.fn(),
  },
}));
let mockUserId = 'one';
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: {
    getState: () => ({ user: { id: mockUserId, role: 'admin' } }),
  },
}));
const detail = (id: string): ProjectDetail => ({
  id,
  project_name: id,
  client_name: 'Client',
  start_date: '2026-01-01',
  estimated_finish: '2026-02-01',
  created_at: '',
  created_by: 'one',
  status: 'pending',
  stages: [],
});
beforeEach(() => {
  jest.resetAllMocks();
  mockUserId = 'one';
  useProjectStore.getState().resetForSession();
  useProjectStore.setState({ selectedProject: detail('old') });
});
it('does not refresh or clear another account after an old deletion', async () => {
  const pending = deferred<void>();
  jest.mocked(projectService.deleteProject).mockReturnValue(pending.promise);
  const deleting = useProjectStore.getState().deleteProject('old');
  mockUserId = 'two';
  useProjectStore.getState().resetForSession();
  useProjectStore.setState({ selectedProject: detail('new') });
  pending.resolve();
  await deleting;
  expect(projectService.getProjects).not.toHaveBeenCalled();
  expect(useProjectStore.getState().selectedProject?.id).toBe('new');
});
it('does not reopen a previous detail screen after a stage update', async () => {
  const pending = deferred<void>();
  jest
    .mocked(projectService.updateStageStatus)
    .mockReturnValue(pending.promise);
  const saving = useProjectStore.getState().updateStageStatus('stage', 'done');
  useProjectStore.setState({ selectedProject: detail('new') });
  pending.resolve();
  await saving;
  expect(projectService.getProjectDetail).not.toHaveBeenCalled();
});
it('keeps mutation errors from a previous session out of the new state', async () => {
  const pending = deferred<void>();
  jest
    .mocked(projectService.updateStageStatus)
    .mockReturnValue(pending.promise);
  const saving = useProjectStore.getState().updateStageStatus('stage', 'done');
  mockUserId = 'two';
  useProjectStore.getState().resetForSession();
  pending.reject(new Error('Old failure'));
  await expect(saving).rejects.toThrow('Old failure');
  expect(useProjectStore.getState().error).toBeNull();
});
it('refreshes the same selected project after a successful mutation', async () => {
  jest.mocked(projectService.updateStageStatus).mockResolvedValue();
  jest.mocked(projectService.getProjectDetail).mockResolvedValue(detail('old'));
  await useProjectStore.getState().updateStageStatus('stage', 'done');
  expect(projectService.getProjectDetail).toHaveBeenCalledWith('old', 'admin');
  expect(useProjectStore.getState().isLoadingDetail).toBe(false);
});
