'use strict';

const jwt = require('jsonwebtoken');
const { supabaseAdmin } = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token otorisasi diperlukan' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (_localErr) {
    if (supabaseAdmin) {
      try {
        const {
          data: { user: authUser },
          error: supabaseAuthErr,
        } = await supabaseAdmin.auth.getUser(token);

        if (!supabaseAuthErr && authUser) {
          const { data: profile } = await supabaseAdmin
            .from('users')
            .select('role')
            .eq('id', authUser.id)
            .maybeSingle();

          req.user = {
            id: authUser.id,
            email: authUser.email,
            role: profile ? profile.role : 'client',
          };
          return next();
        }
      } catch (supabaseErr) {
        console.error('[SUPABASE AUTH MIDDLEWARE ERROR]:', supabaseErr.message);
      }
    }
  }

  return res.status(403).json({ success: false, message: 'Token tidak valid atau kedaluwarsa' });
}

module.exports = { authenticateToken };
