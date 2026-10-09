'use strict';

const express = require('express');
const { run, get, all } = require('../database');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { recalculateProjectStatus } = require('../helpers/projectHelpers');

const router = express.Router();

router.get('/dashboard/stats', authenticateToken, async (_req, res) => {
  try {
    const rows = await all(`
      SELECT status, COUNT(*) as count
      FROM projects
      GROUP BY status
    `);

    const stats = { total: 0, pending: 0, on_progress: 0, done: 0, on_hold: 0 };
    for (const row of rows) {
      stats[row.status] = row.count;
      stats.total += row.count;
    }

    res.json({ success: true, stats });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik' });
  }
});

router.get('/projects', authenticateToken, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'client') {
      const clientUser = await get('SELECT name FROM users WHERE id = ?', [req.user.id]);
      const clientName = clientUser ? clientUser.name : '';
      projects = await all(
        'SELECT * FROM projects WHERE client_id = ? OR client_name = ? OR created_by = ?',
        [req.user.id, clientName, req.user.id],
      );
    } else {
      projects = await all('SELECT * FROM projects');
    }
    res.json({ success: true, projects });
  } catch (err) {
    console.error('Fetch projects error:', err);
    res.status(500).json({ success: false, message: 'Kesalahan mengambil data proyek' });
  }
});

router.get('/projects/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;

  try {
    const project = await get('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan' });
    }

    if (req.user.role === 'client') {
      const clientUser = await get('SELECT name FROM users WHERE id = ?', [req.user.id]);
      const clientName = clientUser ? clientUser.name : '';
      if (
        project.client_id !== req.user.id &&
        project.client_name !== clientName &&
        project.created_by !== req.user.id
      ) {
        return res.status(403).json({ success: false, message: 'Akses ditolak. Anda tidak berwenang melihat proyek ini.' });
      }
    }

    const safeProject = { ...project };
    if (req.user.role === 'client') {
      delete safeProject.project_code;
      delete safeProject.budget;
    }

    const stages = await all('SELECT * FROM project_stages WHERE project_id = ? ORDER BY sequence ASC', [projectId]);

    for (const stage of stages) {
      stage.updates = await all('SELECT * FROM stage_updates WHERE stage_id = ? ORDER BY created_at DESC', [stage.id]);
      stage.files = await all('SELECT * FROM project_files WHERE stage_id = ? ORDER BY created_at DESC', [stage.id]);
    }

    res.json({ success: true, project: { ...safeProject, stages } });
  } catch (err) {
    console.error('Fetch project detail error:', err);
    res.status(500).json({ success: false, message: 'Kesalahan mengambil rincian proyek' });
  }
});

router.put('/stages/:id', authenticateToken, async (req, res) => {
  const stageId = req.params.id;
  const { status } = req.body;

  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ success: false, message: 'Hanya Admin & Engineer yang diizinkan merubah status tahapan' });
  }

  if (!status || !['pending', 'in_progress', 'done'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Status tidak valid' });
  }

  try {
    const stage = await get('SELECT * FROM project_stages WHERE id = ?', [stageId]);
    if (!stage) {
      return res.status(404).json({ success: false, message: 'Tahapan tidak ditemukan' });
    }

    await run(
      'UPDATE project_stages SET status = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, req.user.id, stageId],
    );

    await recalculateProjectStatus(stage.project_id);

    res.json({ success: true, message: 'Status tahapan dan status proyek berhasil diperbarui' });
  } catch (err) {
    console.error('Update stage error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui tahapan' });
  }
});

router.put('/projects/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;
  const {
    project_code, project_name, client_name, budget,
    start_date, estimated_finish, status, client_id, marketing_id, engineer_id,
  } = req.body;

  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya Admin dan Engineer yang dapat mengedit proyek.' });
  }

  try {
    const project = await get('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan' });
    }

    await run(
      `UPDATE projects SET
        project_code = ?,
        project_name = ?,
        client_name = ?,
        budget = ?,
        start_date = ?,
        estimated_finish = ?,
        status = ?,
        client_id = ?,
        marketing_id = ?,
        engineer_id = ?
      WHERE id = ?`,
      [
        project_code || project.project_code,
        project_name || project.project_name,
        client_name || project.client_name,
        budget !== undefined ? budget : project.budget,
        start_date || project.start_date,
        estimated_finish || project.estimated_finish,
        status || project.status,
        client_id !== undefined ? client_id : project.client_id,
        marketing_id !== undefined ? marketing_id : project.marketing_id,
        engineer_id !== undefined ? engineer_id : project.engineer_id,
        projectId,
      ],
    );

    res.json({ success: true, message: 'Detail proyek berhasil diperbarui' });
  } catch (err) {
    console.error('Update project error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui detail proyek' });
  }
});

router.put('/stages/:id/details', authenticateToken, async (req, res) => {
  const stageId = req.params.id;
  const { title, description } = req.body;

  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya Admin dan Engineer yang dapat mengedit tahapan.' });
  }

  if (!title) {
    return res.status(400).json({ success: false, message: 'Judul tahapan wajib diisi' });
  }

  try {
    const stage = await get('SELECT * FROM project_stages WHERE id = ?', [stageId]);
    if (!stage) {
      return res.status(404).json({ success: false, message: 'Tahapan tidak ditemukan' });
    }

    await run(
      'UPDATE project_stages SET title = ?, description = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title.trim(), description ? description.trim() : null, req.user.id, stageId],
    );

    res.json({ success: true, message: 'Detail tahapan proyek berhasil diperbarui' });
  } catch (err) {
    console.error('Update stage details error:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui tahapan' });
  }
});

router.delete('/projects/:id', authenticateToken, async (req, res) => {
  const projectId = req.params.id;

  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya Admin dan Engineer yang dapat menghapus proyek.' });
  }

  try {
    const project = await get('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan' });
    }

    await run('DELETE FROM projects WHERE id = ?', [projectId]);
    res.json({ success: true, message: 'Proyek berhasil dihapus' });
  } catch (err) {
    console.error('Delete project error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus proyek' });
  }
});

router.delete('/stages/:id', authenticateToken, async (req, res) => {
  const stageId = req.params.id;

  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ success: false, message: 'Akses ditolak. Hanya Admin dan Engineer yang dapat menghapus tahapan proyek.' });
  }

  try {
    const stage = await get('SELECT id, project_id FROM project_stages WHERE id = ?', [stageId]);
    if (!stage) {
      return res.status(404).json({ success: false, message: 'Tahapan tidak ditemukan' });
    }

    await run('DELETE FROM project_stages WHERE id = ?', [stageId]);

    await recalculateProjectStatus(stage.project_id);

    res.json({ success: true, message: 'Tahapan proyek berhasil dihapus' });
  } catch (err) {
    console.error('Delete stage error:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus tahapan proyek' });
  }
});

router.post('/stages/:id/updates', authenticateToken, async (req, res) => {
  const stageId = req.params.id;
  const { description, progress } = req.body;

  if (req.user.role !== 'admin' && req.user.role !== 'engineer') {
    return res.status(403).json({ success: false, message: 'Akses ditolak' });
  }

  if (!description) {
    return res.status(400).json({ success: false, message: 'Deskripsi catatan wajib diisi' });
  }

  try {
    const stage = await get('SELECT * FROM project_stages WHERE id = ?', [stageId]);
    if (!stage) {
      return res.status(404).json({ success: false, message: 'Tahapan tidak ditemukan' });
    }

    await run(
      'INSERT INTO stage_updates (stage_id, description, progress, created_by) VALUES (?, ?, ?, ?)',
      [stageId, description.trim(), progress || null, req.user.id],
    );

    res.status(201).json({ success: true, message: 'Catatan kemajuan pekerjaan berhasil ditambahkan' });
  } catch (err) {
    console.error('Add stage update error:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan catatan' });
  }
});

module.exports = router;
