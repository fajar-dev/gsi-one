'use strict';

const express = require('express');
const { run } = require('../database');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/notifications', authenticateToken, async (req, res) => {
  const { userId, targetRole, title, message, type, referenceId } = req.body;

  if (!title || !message || !type) {
    return res.status(400).json({ success: false, message: 'Title, message, dan type wajib diisi' });
  }

  try {
    await run(
      `INSERT INTO notifications (user_id, target_role, title, message, type, reference_id, is_read)
       VALUES (?, ?, ?, ?, ?, ?, false)`,
      [userId || null, targetRole || null, title.trim(), message.trim(), type.trim(), referenceId || null],
    );

    res.status(201).json({ success: true, message: 'Notifikasi berhasil dibuat' });
  } catch (err) {
    console.error('Create notification error:', err);
    res.status(500).json({ success: false, message: 'Gagal membuat notifikasi' });
  }
});

module.exports = router;
