import type { Project, ProjectStatus } from './project';

export type ProjectStatistics = { total: number } & Record<
  ProjectStatus,
  number
>;

export function calculateProjectStatistics(
  projects: readonly Project[],
): ProjectStatistics {
  const stats: ProjectStatistics = {
    total: projects.length,
    pending: 0,
    on_progress: 0,
    done: 0,
    on_hold: 0,
  };
  for (const project of projects) stats[project.status]++;
  return stats;
}
