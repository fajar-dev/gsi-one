import { SupabaseProjectRepository } from '../../src/services/repositories/SupabaseProjectRepository';
import { notificationService } from '../../src/services/notificationService';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Integration Flow - Project & Notification Cycle', () => {
  let repository: SupabaseProjectRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SupabaseProjectRepository();
  });

  it('should execute end-to-end project retrieval and notification mark-as-read cycle', async () => {
    const mockProjectsData = [
      {
        id: 'p-999',
        project_code: 'GSI-FLOW-001',
        project_name: 'Proyek Integrasi Test',
        client_name: 'Client Flow',
        status: 'on_progress',
        created_by: 'usr-admin',
        created_at: '2026-07-30T10:00:00Z',
      },
    ];

    const mockOrderProj = jest.fn().mockResolvedValue({ data: mockProjectsData, error: null });
    const mockSelectProj = jest.fn().mockReturnValue({ order: mockOrderProj });
    (supabase.from as jest.Mock).mockReturnValueOnce({ select: mockSelectProj });

    const projects = await repository.getProjects('usr-admin', 'admin');
    expect(projects).toHaveLength(1);
    expect(projects[0].project_code).toBe('GSI-FLOW-001');

    const mockSelectNotif = jest.fn().mockResolvedValue({ data: [{ id: 'notif-999' }], error: null });
    const mockEqNotif = jest.fn().mockReturnValue({ select: mockSelectNotif });
    const mockUpdateNotif = jest.fn().mockReturnValue({ eq: mockEqNotif });
    (supabase.from as jest.Mock).mockReturnValueOnce({ update: mockUpdateNotif });

    await notificationService.markAsRead('notif-999');
    expect(mockUpdateNotif).toHaveBeenCalledWith({ is_read: true });
    expect(mockEqNotif).toHaveBeenCalledWith('id', 'notif-999');
    expect(mockSelectNotif).toHaveBeenCalledWith('id');
  });
});
