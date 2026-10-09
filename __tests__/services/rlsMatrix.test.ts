import { SupabaseProjectRepository } from '../../src/services/repositories/SupabaseProjectRepository';
import { supabase } from '../../src/config/supabase';

jest.mock('../../src/config/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('RLS Authorization Matrix & Strict ID Filtering', () => {
  let repository: SupabaseProjectRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new SupabaseProjectRepository();
  });

  it('should query client projects strictly using client_id and created_by (without client_name fallback)', async () => {
    const mockOr = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
    const mockSelect = jest.fn().mockReturnValue({ or: mockOr });
    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

    await repository.getProjects('usr-client-123', 'client');

    expect(supabase.from).toHaveBeenCalledWith('projects');
    expect(mockOr).toHaveBeenCalledWith('client_id.eq.usr-client-123,created_by.eq.usr-client-123');
  });

  it('should query marketing projects strictly using marketing_id and created_by', async () => {
    const mockOr = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
    const mockSelect = jest.fn().mockReturnValue({ or: mockOr });
    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

    await repository.getProjects('usr-mkt-456', 'marketing');

    expect(supabase.from).toHaveBeenCalledWith('projects');
    expect(mockOr).toHaveBeenCalledWith('marketing_id.eq.usr-mkt-456,created_by.eq.usr-mkt-456');
  });

  it('should query engineer projects strictly using engineer_id and created_by', async () => {
    const mockOr = jest.fn().mockReturnValue({
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
    });
    const mockSelect = jest.fn().mockReturnValue({ or: mockOr });
    (supabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

    await repository.getProjects('usr-eng-789', 'engineer');

    expect(supabase.from).toHaveBeenCalledWith('projects');
    expect(mockOr).toHaveBeenCalledWith('engineer_id.eq.usr-eng-789,created_by.eq.usr-eng-789');
  });
});
