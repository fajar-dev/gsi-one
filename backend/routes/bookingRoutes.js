'use strict';

const express = require('express');
const { run } = require('../database');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

async function handleBooking(req, res) {
  const { full_name, company_name, email, phone, service_type, location, preferred_date, message } = req.body;

  if (!full_name || !email || !phone || !service_type || !location || !preferred_date) {
    return res.status(400).json({
      success: false,
      message: 'Field nama, email, telepon, layanan, lokasi, dan tanggal wajib diisi',
    });
  }

  try {
    await run(
      `INSERT INTO bookings (full_name, company_name, email, phone, service_type, location, preferred_date, message, submitted_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name.trim(),
        company_name ? company_name.trim() : null,
        email.trim(),
        phone.trim(),
        service_type,
        location.trim(),
        preferred_date,
        message ? message.trim() : null,
        req.user.id,
      ],
    );

    res.status(201).json({ success: true, message: 'Booking survey berhasil diajukan, tim kami akan segera menghubungi Anda' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
  }
}

router.post('/booking', authenticateToken, handleBooking);
router.post('/booking.php', authenticateToken, handleBooking);

module.exports = router;
