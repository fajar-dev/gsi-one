// Compose a destructive reset and the canonical seed in one atomic transaction.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const seed = fs.readFileSync(path.join(root, 'supabase/seed.sql'), 'utf8');
const reset = fs.readFileSync(
  path.join(root, 'supabase/reset_data.sql'),
  'utf8',
);
if (
  (seed.match(/^BEGIN;$/gm) || []).length !== 1 ||
  !/^COMMIT;\s*$/m.test(seed)
) {
  throw new Error('Seed harus memiliki satu transaksi BEGIN/COMMIT.');
}
const destination = path.join(root, 'audit/reset-and-seed.sql');
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(
  destination,
  '-- GENERATED: hapus seluruh data aplikasi/Auth lalu seed ulang.\n' +
    '-- Sumber: supabase/reset_data.sql + supabase/seed.sql.\n' +
    '-- Jalankan SELURUH isi di SQL Editor, bukan sebagian query.\n\n' +
    seed.replace(/^BEGIN;$/m, `BEGIN;\n\n${reset}`),
  { mode: 0o600 },
);
console.log(`Skrip reset + seed siap: ${destination}`);
