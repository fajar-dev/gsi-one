import { ProjectQueryRepository } from '../../src/infrastructure/supabase/projects/ProjectQueryRepository';
import { supabase } from '../../src/config/supabase';
jest.mock('../../src/config/supabase', () => ({
  supabase: { from: jest.fn() },
}));
it('normalizes nested IDs and retains detached files even without any stages', async () => {
  const projectQuery = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({
      data: { id: 1, project_name: 'Test' },
      error: null,
    }),
  };
  const rows = [
    [],
    [],
    [
      {
        id: 9,
        project_id: 1,
        stage_id: null,
        file_name: 'Kept.pdf',
        file_url: '1/kept.pdf',
        file_type: 'report',
      },
    ],
  ];
  (supabase.from as jest.Mock).mockImplementation(table => {
    if (table === 'projects_with_budget') return projectQuery;
    return {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: rows.shift(), error: null }),
    };
  });
  const result = await new ProjectQueryRepository().getProjectDetail('1');
  expect(result.id).toBe('1');
  expect(result.stages).toEqual([]);
  expect(result.files?.[0]).toMatchObject({
    id: '9',
    project_id: '1',
    stage_id: null,
  });
});
