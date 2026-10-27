// Run after supabase/seed.sql. Uses an ordinary staff session and Storage RLS.
const fs = require('node:fs');
const path = require('node:path');
const { parseEnv } = require('node:util');
const { createClient } = require('@supabase/supabase-js');
async function main() {
  const root = path.resolve(__dirname, '..');
  const env = {
    ...parseEnv(fs.readFileSync(path.join(root, '.env'), 'utf8')),
    ...process.env,
  };
  const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: loginError } = await client.auth.signInWithPassword({
    email: env.SEED_ADMIN_EMAIL || 'admin@grahasurvei.com',
    password: env.SEED_ADMIN_PASSWORD || 'password123',
  });
  if (loginError)
    throw new Error(
      'Login seed gagal. Isi SEED_ADMIN_EMAIL dan SEED_ADMIN_PASSWORD untuk akun staff.',
    );
  try {
    const { data: project, error: projectError } = await client
      .from('projects')
      .select('id')
      .eq('project_code', 'PRJ-NDT-001')
      .single();
    if (projectError || !project)
      throw new Error('Proyek demo PRJ-NDT-001 belum tersedia.');
    const { data: files, error } = await client
      .from('project_files')
      .select('id,project_id')
      .eq('project_id', project.id)
      .eq('file_name', 'Dokumentasi_Survey_Lantai1.jpg');
    if (error) throw error;
    if (!files?.length)
      throw new Error('Jalankan supabase/seed.sql terlebih dahulu.');
    const bytes = fs.readFileSync(
      path.join(root, 'assets/images/Images-1.jpeg'),
    );
    for (const file of files) {
      const filePath = `${file.project_id}/seed-documentation.jpg`;
      const { error: uploadError } = await client.storage
        .from('projects')
        .upload(filePath, bytes, { contentType: 'image/jpeg', upsert: true });
      if (uploadError) throw uploadError;
      const { error: metadataError } = await client
        .from('project_files')
        .update({ file_url: filePath })
        .eq('id', file.id);
      if (metadataError) throw metadataError;
      const { data: signed, error: signedError } = await client.storage
        .from('projects')
        .createSignedUrl(filePath, 60);
      if (signedError || !signed)
        throw signedError || new Error('Signed URL kosong');
      const result = await fetch(signed.signedUrl);
      if (
        !result.ok ||
        (await result.arrayBuffer()).byteLength !== bytes.length
      )
        throw new Error('Verifikasi foto seed gagal.');
    }
    console.log(
      `Foto demo privat berhasil diunggah dan diverifikasi (${files.length} berkas).`,
    );
  } finally {
    await client.auth.signOut({ scope: 'local' });
  }
}
main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
