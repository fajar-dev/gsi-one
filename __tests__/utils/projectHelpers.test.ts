import { getProjectDuration } from '../../src/utils/projectHelpers';
import { summarizeStages } from '../../src/domain/models/projectProgress';
import type { ProjectStage } from '../../src/domain/models/project';
const stage = (status: ProjectStage['status']): ProjectStage => ({
  id: status,
  project_id: '1',
  title: status,
  description: '',
  sequence: 1,
  status,
  updated_by: 'admin',
  updated_at: '2026-10-27',
});
describe('project summaries use available data', () => {
  it('does not fabricate a duration for missing or invalid dates', () => {
    expect(getProjectDuration()).toBe('Jadwal belum ditentukan');
    expect(getProjectDuration('bad', '2026-10-27')).toBe('Jadwal belum valid');
    expect(getProjectDuration('2026-11-01', '2026-10-01')).toBe(
      'Jadwal belum valid',
    );
  });
  it('shows the actual interval in days', () => {
    expect(getProjectDuration('2026-10-01', '2026-10-16')).toBe(
      'Durasi Proyek: 15 Hari',
    );
  });
  it('does not invent completed or in-progress stages for an empty/pending project', () => {
    expect(summarizeStages()).toMatchObject({
      total: 0,
      completed: 0,
      inProgress: 0,
      percent: 0,
      active: null,
    });
    expect(summarizeStages([stage('pending')])).toMatchObject({
      total: 1,
      completed: 0,
      inProgress: 0,
      percent: 0,
    });
  });
  it('counts stored stages and selects the stage in progress', () => {
    const active = stage('in_progress');
    expect(
      summarizeStages([stage('done'), stage('pending'), active]),
    ).toMatchObject({
      total: 3,
      completed: 1,
      inProgress: 1,
      percent: 33,
      active,
    });
  });
});
