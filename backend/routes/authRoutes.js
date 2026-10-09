'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { run, get, all } = require('../database');
const { supabaseAdmin } = require('../config/supabase');
const { authenticateToken } = require('../middlewares/authMiddleware');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

function maskEmail(email) {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const visible = local.length <= 2 ? local[0] : local.slice(0, 2);
  return `${visible}***@${domain}`;
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
  skip: (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  },
});

router.post('/register', (_req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Pendaftaran mandiri sementara dinonaktifkan. Silakan hubungi Administrator.',
  });
});

router.post('/register.php', (_req, res) => {
  return res.status(403).json({
    success: false,
    message: 'Pendaftaran mandiri sementara dinonaktifkan. Silakan hubungi Administrator.',
  });
});

router.post('/auth/lookup-ticket', authLimiter, async (req, res) => {
  const { ticket_number } = req.body;
  if (!ticket_number) {
    return res.status(400).json({ success: false, message: 'Nomor tiket wajib diisi' });
  }

  const ticketClean = ticket_number.trim();

  try {
    if (supabaseAdmin) {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('email')
        .ilike('ticket_number', ticketClean)
        .maybeSingle();

      if (user && user.email) {
        return res.json({ success: true, email: user.email });
      }

      const { data: { users: authUsers }, error: authSearchErr } = await supabaseAdmin.auth.admin.listUsers();
      if (!authSearchErr && authUsers) {
        const matchedUser = authUsers.find(
          u => u.user_metadata && u.user_metadata.ticket_number && u.user_metadata.ticket_number.toLowerCase() === ticketClean.toLowerCase(),
        );

        if (matchedUser && matchedUser.email) {
          const ticketNum = matchedUser.user_metadata.ticket_number;
          const userRole = matchedUser.user_metadata.role || 'client';
          const fullName = matchedUser.user_metadata.full_name || matchedUser.user_metadata.name || 'User Baru';

          await supabaseAdmin
            .from('users')
            .upsert({
              id: matchedUser.id,
              name: fullName,
              email: matchedUser.email,
              role: userRole,
              ticket_number: ticketNum,
            }, { onConflict: 'id' });

          return res.json({ success: true, email: matchedUser.email });
        }
      }
    }

    const localUser = await get('SELECT email FROM users WHERE LOWER(ticket_number) = LOWER(?)', [ticketClean]);
    if (localUser && localUser.email) {
      return res.json({ success: true, email: localUser.email });
    }

    return res.status(444).json({ success: false, message: `Nomor Tiket Klien (${ticketClean}) tidak ditemukan` });
  } catch (err) {
    console.error('[LOOKUP TICKET ERROR]:', err);
    return res.status(500).json({ success: false, message: 'Gagal mencari nomor tiket' });
  }
});

router.post('/admin/create-user', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Akses ditolak: Hanya Admin yang dapat mendaftarkan pengguna baru' });
  }

  const { name, email, password, role, ticket_number } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Nama, email, password, dan role wajib diisi' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password harus minimal 8 karakter' });
  }

  if (!['client', 'marketing', 'engineer'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role tidak valid. Pilih client, marketing, atau engineer' });
  }

  try {
    const localUser = await get('SELECT id FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (localUser) {
      return res.status(409).json({ success: false, message: 'Email sudah terdaftar di sistem lokal' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ success: false, message: 'Supabase Admin Client belum terkonfigurasi di server backend' });
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim().toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name.trim(),
        role,
        ticket_number: ticket_number || undefined,
      },
    });

    if (authError) {
      return res.status(400).json({ success: false, message: `Gagal membuat akun di Supabase: ${authError.message}` });
    }

    const authUser = authData.user;

    const userPayload = {
      id: authUser.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    };
    if (ticket_number) {
      userPayload.ticket_number = ticket_number;
    }

    const { error: profileError } = await supabaseAdmin
      .from('users')
      .upsert(userPayload, { onConflict: 'id' });

    if (profileError) {
      console.error('Warning: Gagal menyinkronkan profil public.users di Supabase:', profileError.message);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    try {
      await run(
        'INSERT INTO users (name, email, password_hash, role, ticket_number) VALUES (?, ?, ?, ?, ?)',
        [name.trim(), email.trim().toLowerCase(), passwordHash, role, ticket_number || null],
      );
    } catch (_sqliteErr) {
      await run(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [name.trim(), email.trim().toLowerCase(), passwordHash, role],
      );
    }

    res.status(201).json({
      success: true,
      message: `Pengguna baru (${name}) dengan role [${role}] berhasil didaftarkan.`,
      user: {
        id: authUser.id,
        email: authUser.email,
        full_name: name.trim(),
        role,
        ticket_number: ticket_number || undefined,
      },
    });
  } catch (err) {
    console.error('Admin create user error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal saat membuat pengguna' });
  }
});

async function handleLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
  }

  try {
    const user = await get('SELECT * FROM users WHERE email = ?', [email.trim().toLowerCase()]);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email atau password salah' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res.json({
      success: true,
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
  }
}

router.post('/login', authLimiter, handleLogin);
router.post('/login.php', authLimiter, handleLogin);

router.get('/users/role/:role', authenticateToken, async (req, res) => {
  const { role } = req.params;
  if (!['client', 'marketing', 'engineer'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Role tidak valid' });
  }

  try {
    const users = await all('SELECT id, name, email FROM users WHERE role = ? ORDER BY name ASC', [role]);
    res.json({ success: true, users });
  } catch (err) {
    console.error('Fetch users by role error:', err);
    res.status(500).json({ success: false, message: 'Gagal memuat pengguna berdasarkan role' });
  }
});

module.exports = router;
