require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error('[ERROR] SUPABASE_URL atau SUPABASE_SECRET_KEY tidak ditemukan di environment variables.');
  process.exit(1);
}

const targetRef = new URL(supabaseUrl).hostname.split('.')[0];
// Wajib konfirmasi target: skrip ini memakai service key, jadi salah arah ke
// project produksi berarti menulis ke data nyata.
if (process.env.SEED_CONFIRM !== targetRef) {
  console.error(`[DIBATALKAN] Skrip ini akan menulis ke project Supabase: ${targetRef}`);
  console.error(`Untuk melanjutkan, jalankan dengan konfirmasi eksplisit:`);
  console.error(`  SEED_CONFIRM=${targetRef} node seed_data.js`);
  process.exit(1);
}
console.log(`Target Supabase dikonfirmasi: ${targetRef}`);

const supabase = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const dbPath = path.join(__dirname, 'gsi_one.db');
const db = new sqlite3.Database(dbPath);

function runSql(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}


const mockupUsers = [
  {
    email: 'admin@grahasurvei.com',
    password: 'password123',
    name: 'Admin GSI',
    role: 'admin'
  },
  {
    email: 'marketing@grahasurvei.com',
    password: 'password123',
    name: 'Rian Marketing',
    role: 'marketing'
  },
  {
    email: 'engineer@grahasurvei.com',
    password: 'password123',
    name: 'Heri Engineer',
    role: 'engineer'
  },
  {
    email: 'client@client.com',
    password: 'password123',
    name: 'Budi Klien',
    role: 'client'
  }
];

async function seedSupabase() {
  console.log('\n--- Memulai Seeding Supabase ---');
  
  const seededUsers = [];
  
  for (const u of mockupUsers) {
    console.log(`Mengatur user auth Supabase: ${u.email}...`);
    
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error(`Gagal mendapatkan list user: ${listError.message}`);
      continue;
    }
    
    let authUser = users.find(user => user.email === u.email);
    
    if (!authUser) {
      const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: {
          full_name: u.name,
          role: u.role
        }
      });
      
      if (createError) {
        console.error(`Gagal membuat user auth ${u.email}: ${createError.message}`);
        continue;
      }
      authUser = user;
      console.log(`User auth ${u.email} berhasil dibuat dengan ID: ${user.id}`);
    } else {
      console.log(`User auth ${u.email} sudah ada dengan ID: ${authUser.id}`);
    }
    
    const { error: profileError } = await supabase
      .from('users')
      .upsert({
        id: authUser.id,
        name: u.name,
        email: u.email,
        role: u.role
      }, { onConflict: 'id' });
      
    if (profileError) {
      console.error(`Gagal menyimpan profil public.users untuk ${u.email}: ${profileError.message}`);
    } else {
      console.log(`Profil public.users untuk ${u.email} berhasil disinkronkan.`);
    }
    
    seededUsers.push({ ...u, id: authUser.id });
  }

  const adminUser = seededUsers.find(u => u.role === 'admin');
  const engineerUser = seededUsers.find(u => u.role === 'engineer');
  const marketingUser = seededUsers.find(u => u.role === 'marketing');
  const clientUser = seededUsers.find(u => u.role === 'client');

  if (!adminUser || !engineerUser || !marketingUser || !clientUser) {
    console.error('Gagal menemukan semua user role untuk relasi data proyek.');
    return;
  }

  // Penghapusan massal harus diminta eksplisit; sebelumnya berjalan tanpa syarat.
  if (process.env.SEED_ALLOW_DESTRUCTIVE === 'true') {
    console.log('Menghapus seluruh proyek lama di Supabase (SEED_ALLOW_DESTRUCTIVE=true)...');
    const { error: deleteErr } = await supabase.from('projects').delete().neq('project_code', '');
    if (deleteErr) {
      console.error('[ERROR] Gagal menghapus proyek lama:', deleteErr.message);
      process.exit(1);
    }
  } else {
    console.log('Melewati penghapusan proyek lama (set SEED_ALLOW_DESTRUCTIVE=true untuk mengizinkan).');
  }

  console.log('Membuat data proyek mockup di Supabase...');
  
  const projectsMock = [
    {
      project_code: 'PRJ-NDT-001',
      project_name: 'Non-Destructive Testing Ruko 3 Lantai',
      client_name: 'Budi Klien (PT Mulia Jaya)',
      budget: 85000000,
      start_date: '2026-07-01',
      estimated_finish: '2026-07-25',
      status: 'on_progress',
      created_by: marketingUser.id,
      stages: [
        { title: 'Penandatanganan Kontrak', description: 'Negosiasi harga dan tanda tangan kontrak kerja sama NDT.', sequence: 1, status: 'done', updated_by: adminUser.id },
        { title: 'Survey & Scanning Beton', description: 'Melakukan UPV (Ultrasonic Pulse Velocity) & Rebound Hammer Test.', sequence: 2, status: 'in_progress', updated_by: engineerUser.id,
          updates: [
            { description: 'Scanning kolom lantai 1 selesai dilakukan. Siap lanjut ke lantai 2.', progress: 40, created_by: engineerUser.id }
          ],
          files: [
            { file_name: 'Dokumentasi_Survey_Lantai1.jpg', file_url: 'https://grahasurvei.com/uploads/sample_survey.jpg', file_type: 'image', uploaded_by: engineerUser.id }
          ]
        },
        { title: 'Analisis & Rekomendasi', description: 'Pengolahan data uji dan penyusunan laporan rekomendasi struktur.', sequence: 3, status: 'pending', updated_by: engineerUser.id }
      ]
    },
    {
      project_code: 'PRJ-SHMS-002',
      project_name: 'Structural Health Monitoring System Jembatan Baja',
      client_name: 'Budi Klien (Dinas Pekerjaan Umum)',
      budget: 420000000,
      start_date: '2026-06-15',
      estimated_finish: '2026-08-15',
      status: 'on_progress',
      created_by: adminUser.id,
      stages: [
        { title: 'Desain Peletakan Sensor', description: 'Perencanaan posisi sensor regangan, akselerometer, dan temperatur.', sequence: 1, status: 'done', updated_by: adminUser.id },
        { title: 'Instalasi Kabel & Sensor', description: 'Pemasangan sensor fisik dan penarikan kabel fiber optik di sepanjang bentang jembatan.', sequence: 2, status: 'in_progress', updated_by: engineerUser.id,
          updates: [
            { description: 'Pemasangan kabel fiber optik di bentang utama selesai 80%.', progress: 60, created_by: engineerUser.id }
          ]
        },
        { title: 'Uji Coba Transmisi Data', description: 'Kalibrasi sinyal sensor dan pengiriman telemetry data ke server pusat.', sequence: 3, status: 'pending', updated_by: engineerUser.id },
        { title: 'Serah Terima & Pelatihan', description: 'Pelatihan operator dinas PU dan serah terima dokumen manual penggunaan.', sequence: 4, status: 'pending', updated_by: adminUser.id }
      ]
    },
    {
      project_code: 'PRJ-LOAD-003',
      project_name: 'Loading Test Jembatan Tol Cikampek',
      client_name: 'PT Jasa Marga',
      budget: 150000000,
      start_date: '2026-08-01',
      estimated_finish: '2026-08-10',
      status: 'pending',
      created_by: marketingUser.id,
      stages: [
        { title: 'Persiapan Beban Truk', description: 'Menimbang truk penguji dengan beban penuh pasir/batu sesuai standar SNI.', sequence: 1, status: 'pending', updated_by: engineerUser.id },
        { title: 'Pengujian Statik & Dinamik', description: 'Pemberian beban bertahap pada jembatan dan pembacaan lendutan.', sequence: 2, status: 'pending', updated_by: engineerUser.id },
        { title: 'Laporan Hasil Uji Beban', description: 'Analisis kapasitas beban layak jembatan tol.', sequence: 3, status: 'pending', updated_by: engineerUser.id }
      ]
    }
  ];

  for (const proj of projectsMock) {
    console.log(`Membuat proyek Supabase: ${proj.project_name}...`);
    
    const { data: dbProj, error: pErr } = await supabase
      .from('projects')
      .insert({
        project_code: proj.project_code,
        project_name: proj.project_name,
        client_name: proj.client_name,
        budget: proj.budget,
        start_date: proj.start_date,
        estimated_finish: proj.estimated_finish,
        status: proj.status,
        created_by: proj.created_by
      })
      .select()
      .single();

    if (pErr) {
      console.error(`Gagal membuat proyek ${proj.project_code}: ${pErr.message}`);
      continue;
    }

    for (const st of proj.stages) {
      const { data: dbStage, error: stErr } = await supabase
        .from('project_stages')
        .insert({
          project_id: dbProj.id,
          title: st.title,
          description: st.description,
          sequence: st.sequence,
          status: st.status,
          updated_by: st.updated_by
        })
        .select()
        .single();

      if (stErr) {
        console.error(`Gagal membuat stage ${st.title}: ${stErr.message}`);
        continue;
      }

      if (st.updates) {
        for (const up of st.updates) {
          const { error: upErr } = await supabase
            .from('stage_updates')
            .insert({
              stage_id: dbStage.id,
              description: up.description,
              progress: up.progress,
              created_by: up.created_by
            });
          if (upErr) console.error(`Gagal membuat update stage: ${upErr.message}`);
        }
      }

      if (st.files) {
        for (const fl of st.files) {
          const { error: flErr } = await supabase
            .from('project_files')
            .insert({
              project_id: dbProj.id,
              stage_id: dbStage.id,
              file_name: fl.file_name,
              file_url: fl.file_url,
              file_type: fl.file_type,
              uploaded_by: fl.uploaded_by
            });
          if (flErr) console.error(`Gagal mencatat file: ${flErr.message}`);
        }
      }
    }
  }
  
  console.log('--- Seeding Supabase Selesai ---');
}

async function seedSQLite() {
  console.log('\n--- Memulai Seeding SQLite Lokal ---');
  
  try {
    await runSql('DELETE FROM stage_updates');
    await runSql('DELETE FROM project_files');
    await runSql('DELETE FROM project_stages');
    await runSql('DELETE FROM projects');
    await runSql('DELETE FROM users');
    
    await runSql('DELETE FROM sqlite_sequence WHERE name IN ("users", "projects", "project_stages", "stage_updates", "project_files")');
    
    console.log('Tabel SQLite berhasil dibersihkan.');
 
    const passHash = await bcrypt.hash('password123', 10);
    
    const userMap = {};
    for (const u of mockupUsers) {
      const res = await runSql(
        'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [u.name, u.email, passHash, u.role]
      );
      userMap[u.role] = res.lastID;
      console.log(`SQLite User [${u.role}] dibuat dengan ID: ${res.lastID}`);
    }

    const adminId = userMap.admin;
    const engineerId = userMap.engineer;
    const marketingId = userMap.marketing;

    const p1 = (await runSql(`
      INSERT INTO projects (project_code, project_name, client_name, budget, start_date, estimated_finish, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PRJ-NDT-001', 'Non-Destructive Testing Ruko 3 Lantai', 'Budi Klien (PT Mulia Jaya)', 85000000, '2026-07-01', '2026-07-25', 'on_progress', marketingId]
    )).lastID;

    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p1, 'Penandatanganan Kontrak', 'Negosiasi harga dan tanda tangan kontrak NDT.', 1, 'done', adminId]);
    const s1_2 = (await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p1, 'Survey & Scanning Beton', 'Melakukan UPV & Rebound Hammer Test.', 2, 'in_progress', engineerId])).lastID;
    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p1, 'Analisis & Rekomendasi', 'Penyusunan laporan akhir struktur.', 3, 'pending', engineerId]);

    await runSql('INSERT INTO stage_updates (stage_id, description, progress, created_by) VALUES (?, ?, ?, ?)',
      [s1_2, 'Scanning kolom lantai 1 selesai dilakukan. Siap lanjut ke lantai 2.', 40, engineerId]);
    await runSql('INSERT INTO project_files (project_id, stage_id, file_name, file_url, file_type, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p1, s1_2, 'Dokumentasi_Survey_Lantai1.jpg', 'http://localhost:3000/uploads/sample_survey.jpg', 'image', engineerId]);


    const p2 = (await runSql(`
      INSERT INTO projects (project_code, project_name, client_name, budget, start_date, estimated_finish, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PRJ-SHMS-002', 'Structural Health Monitoring System Jembatan Baja', 'Budi Klien (Dinas Pekerjaan Umum)', 420000000, '2026-06-15', '2026-08-15', 'on_progress', adminId]
    )).lastID;

    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p2, 'Desain Peletakan Sensor', 'Perencanaan posisi sensor fisik.', 1, 'done', adminId]);
    const s2_2 = (await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p2, 'Instalasi Kabel & Sensor', 'Pemasangan sensor regangan dan getar.', 2, 'in_progress', engineerId])).lastID;
    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p2, 'Uji Coba Transmisi Data', 'Kalibrasi sinyal sensor.', 3, 'pending', engineerId]);
    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p2, 'Serah Terima & Pelatihan', 'Pelatihan operator dinas PU.', 4, 'pending', adminId]);

    await runSql('INSERT INTO stage_updates (stage_id, description, progress, created_by) VALUES (?, ?, ?, ?)',
      [s2_2, 'Pemasangan kabel fiber optik di bentang utama selesai 80%.', 60, engineerId]);


    const p3 = (await runSql(`
      INSERT INTO projects (project_code, project_name, client_name, budget, start_date, estimated_finish, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PRJ-LOAD-003', 'Loading Test Jembatan Tol Cikampek', 'PT Jasa Marga', 150000000, '2026-08-01', '2026-08-10', 'pending', marketingId]
    )).lastID;

    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p3, 'Persiapan Beban Truk', 'Menimbang truk beban sesuai standar SNI.', 1, 'pending', engineerId]);
    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p3, 'Pengujian Statik & Dinamik', 'Pemberian beban jembatan.', 2, 'pending', engineerId]);
    await runSql('INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by) VALUES (?, ?, ?, ?, ?, ?)',
      [p3, 'Laporan Hasil Uji Beban', 'Analisis kapasitas beban layak jembatan.', 3, 'pending', engineerId]);

    console.log('SQLite Lokal berhasil di-seed dengan 3 proyek mockup.');
  } catch (err) {
    console.error('Error saat seeding SQLite:', err.message);
  } finally {
    db.close();
    console.log('--- Seeding SQLite Lokal Selesai ---');
  }
}

async function main() {
  try {
    await seedSupabase();
    await seedSQLite();
    console.log('\n🌟 Proses seeding seluruhnya selesai dengan sukses!');
  } catch (e) {
    console.error('Terjadi error saat menjalankan script seeding:', e.message);
  }
}

main();
