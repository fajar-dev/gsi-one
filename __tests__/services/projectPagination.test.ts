import { SupabaseProjectRepository } from '../../src/services/repositories/SupabaseProjectRepository';
import { notificationService } from '../../src/services/notificationService';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('Phase 1 - Server-side Pagination & Realtime Filters', () => {
  let repository: SupabaseProjectRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SupabaseProjectRepository();
  });

  it('should apply limit and range pagination when options are provided to getProjects', async () => {
    const mockRange = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockOrder = jest.fn().mockReturnValue({ range: mockRange });
    const mockSelect = jest.fn().mockReturnValue({ order: mockOrder });
    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

    await repository.getProjects('usr-1', 'admin', { limit: 20, offset: 0 });

    expect(supabase.from).toHaveBeenCalledWith('projects_with_budget');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockRange).toHaveBeenCalledWith(0, 19);
  });

  it('should query notifications with server-side Postgres .or() filter and range pagination', async () => {
    const mockRange = jest.fn().mockResolvedValue({ data: [], error: null });
    const mockOrder = jest.fn().mockReturnValue({ range: mockRange });
    const mockOr = jest.fn().mockReturnValue({ order: mockOrder });
    const mockSelect = jest.fn().mockReturnValue({ or: mockOr });
    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

    await notificationService.getNotifications('usr-123', 'client', 20, 0);

    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(mockOr).toHaveBeenCalledWith('user_id.eq.usr-123,target_role.eq.client');
    expect(mockOrder).toHaveBeenCalledWith('created_at', { ascending: false });
    expect(mockRange).toHaveBeenCalledWith(0, 19);
  });
});
