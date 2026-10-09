import { ProjectEntity } from '../../src/domain/entities/ProjectEntity';
import { ProjectDetail } from '../../src/services/projectService';

describe('ProjectEntity', () => {
  const mockProjectDetail: ProjectDetail = {
    id: 'prj-101',
    project_code: 'GSI-2026-001',
    project_name: 'Inspeksi Jembatan Mahakam',
    client_name: 'PT Kideco Jaya Agung',
    budget: 250000000,
    start_date: '2026-01-01',
    estimated_finish: '2026-06-30',
    status: 'on_progress',
    created_by: 'user-admin',
    created_at: '2026-01-01T00:00:00Z',
    stages: [
      {
        id: 'stg-1',
        project_id: 'prj-101',
        title: 'Survey Pendahuluan',
        description: 'Visual inspection',
        sequence: 1,
        status: 'done',
        updated_by: 'user-admin',
        updated_at: '2026-01-10T00:00:00Z',
      },
      {
        id: 'stg-2',
        project_id: 'prj-101',
        title: 'Pengujian NDT',
        description: 'Hammer test',
        sequence: 2,
        status: 'in_progress',
        updated_by: 'user-admin',
        updated_at: '2026-01-15T00:00:00Z',
      },
      {
        id: 'stg-3',
        project_id: 'prj-101',
        title: 'Laporan Akhir',
        description: 'Final report',
        sequence: 3,
        status: 'pending',
        updated_by: 'user-admin',
        updated_at: '2026-01-20T00:00:00Z',
      },
    ],
  };

  it('should instantiate correctly and expose getters', () => {
    const entity = new ProjectEntity(mockProjectDetail);
    expect(entity.id).toBe('prj-101');
    expect(entity.code).toBe('GSI-2026-001');
    expect(entity.name).toBe('Inspeksi Jembatan Mahakam');
    expect(entity.clientName).toBe('PT Kideco Jaya Agung');
    expect(entity.budget).toBe(250000000);
    expect(entity.status).toBe('on_progress');
    expect(entity.stages.length).toBe(3);
  });

  it('should calculate progress percentage based on completed stages', () => {
    const entity = new ProjectEntity(mockProjectDetail);
    expect(entity.getProgressPercentage()).toBe(33);
  });

  it('should return 0 progress percentage when no stages exist', () => {
    const emptyEntity = new ProjectEntity({ ...mockProjectDetail, stages: [] });
    expect(emptyEntity.getProgressPercentage()).toBe(0);
  });

  it('should return 100 progress percentage when all stages are done', () => {
    const allDoneDetail: ProjectDetail = {
      ...mockProjectDetail,
      stages: mockProjectDetail.stages.map(s => ({ ...s, status: 'done' })),
    };
    const entity = new ProjectEntity(allDoneDetail);
    expect(entity.getProgressPercentage()).toBe(100);
  });

  it('should format budget correctly in IDR', () => {
    const entity = new ProjectEntity(mockProjectDetail);
    expect(entity.getFormattedBudget()).toContain('250.000.000');
  });

  it('should detect overdue projects correctly', () => {
    const overdueDetail: ProjectDetail = {
      ...mockProjectDetail,
      estimated_finish: '2020-01-01', 
      status: 'on_progress',
    };
    const entity = new ProjectEntity(overdueDetail);
    expect(entity.isOverdue()).toBe(true);

    const completedDetail: ProjectDetail = {
      ...overdueDetail,
      status: 'done',
    };
    const completedEntity = new ProjectEntity(completedDetail);
    expect(completedEntity.isOverdue()).toBe(false);
  });
});
