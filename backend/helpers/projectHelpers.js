'use strict';

const { run, all } = require('../database');

async function recalculateProjectStatus(projectId) {
  const allStages = await all('SELECT status FROM project_stages WHERE project_id = ?', [projectId]);

  let newProjectStatus = 'on_progress';
  if (allStages && allStages.length > 0) {
    const allDone = allStages.every(s => s.status === 'done');
    const allPending = allStages.every(s => s.status === 'pending');

    if (allDone) {
      newProjectStatus = 'done';
    } else if (allPending) {
      newProjectStatus = 'pending';
    }
  } else {
    newProjectStatus = 'pending'; 
  }

  await run('UPDATE projects SET status = ? WHERE id = ?', [newProjectStatus, projectId]);
}

module.exports = { recalculateProjectStatus };
