'use strict';

const express = require('express');
const fs = require('fs');
const { run, get } = require('../database');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { upload } = require('../config/multer');

const router = express.Router();

router.post('/projects/:id/files', authenticateToken, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'marketing' && req.user.role !== 'engineer') {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error('Failed to delete unauthorized uploaded file:', err);
      }
    }
    return res.status(403).json({ success: false, message: 'Akses ditolak. Pengguna Client tidak diizinkan mengunggah berkas.' });
  }

  const projectId = req.params.id;
  const { stage_id, file_type } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Berkas file wajib diunggah' });
  }

  const fileType = file_type || 'other';

  try {
    const project = await get('SELECT id FROM projects WHERE id = ?', [projectId]);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Proyek tidak ditemukan' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    await run(
      `INSERT INTO project_files (project_id, stage_id, file_name, file_url, file_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [projectId, stage_id || null, req.file.originalname, fileUrl, fileType, req.user.id],
    );

    res.status(201).json({
      success: true,
      message: 'Berkas berhasil diunggah dan disimpan',
      file: {
        file_name: req.file.originalname,
        file_url: fileUrl,
        file_type: fileType,
      },
    });
  } catch (err) {
    console.error('Upload file error:', err);
    res.status(500).json({ success: false, message: 'Gagal mengunggah berkas' });
  }
});

module.exports = router;
