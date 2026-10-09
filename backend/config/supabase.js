'use strict';

const { createClient } = require('@supabase/supabase-js');

let supabaseAdmin = null;

if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
  supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  console.log('[SUPABASE] Admin Client initialized successfully.');
} else {
  console.warn('[WARNING] SUPABASE_URL atau SUPABASE_SECRET_KEY tidak ditemukan di environment backend.');
}

module.exports = { supabaseAdmin };
