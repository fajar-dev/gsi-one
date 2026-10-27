import { projectMapper } from '../../src/infrastructure/supabase/mappers/projectMapper';

describe('projectMapper - Pure DTO Mapping', () => {
  it('should map ProjectRow correctly to Project domain entity', () => {
    const rawRow = {
      id: 101,
      project_code: 'GSI-2026-001',
      project_name: 'Jembatan Suramadu Test',
      client_name: 'Klien Utama',
      budget: 150000000,
      start_date: '2026-08-01',
      estimated_finish: '2026-12-31',
      status: 'on_progress' as const,
      created_by: 'usr-admin',
      client_id: 'usr-client',
      created_at: '2026-07-30T00:00:00Z',
    };

    const entity = projectMapper.mapProjectRowToEntity(rawRow);

    expect(entity.id).toBe('101');
    expect(entity.project_code).toBe('GSI-2026-001');
    expect(entity.project_name).toBe('Jembatan Suramadu Test');
    expect(entity.budget).toBe(150000000);
    expect(entity.status).toBe('on_progress');
  });

  it('should handle missing optional fields gracefully', () => {
    const entity = projectMapper.mapProjectRowToEntity({});

    expect(entity.id).toBe('');
    expect(entity.project_name).toBe('');
    expect(entity.status).toBe('pending');
  });

  it('should map StageRow correctly', () => {
    const stage = projectMapper.mapStageRowToEntity({
      id: 5,
      project_id: 'proj-101',
      title: 'Tahap 1: Survei',
      sequence: 1,
      status: 'done',
    });

    expect(stage.id).toBe('5');
    expect(stage.title).toBe('Tahap 1: Survei');
    expect(stage.sequence).toBe(1);
  });
});
