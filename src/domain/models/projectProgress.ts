import type { ProjectStage } from './project';

/** Stage counts come from stored stages; they do not imply asset inspection counts. */
export function summarizeStages(stages: readonly ProjectStage[] = []) {
  const total = stages.length;
  const completed = stages.filter(stage => stage.status === 'done').length;
  const inProgress = stages.filter(
    stage => stage.status === 'in_progress',
  ).length;
  const active =
    stages.find(stage => stage.status === 'in_progress') ??
    stages.find(stage => stage.status === 'pending') ??
    stages[stages.length - 1] ??
    null;
  return {
    total,
    completed,
    inProgress,
    percent: total ? Math.round((completed / total) * 100) : 0,
    active,
  };
}
