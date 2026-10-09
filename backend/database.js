const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'gsi_one.db');
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initDatabase() {
  await run('PRAGMA foreign_keys = ON');

  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'marketing', 'engineer', 'client')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      company_name TEXT,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service_type TEXT NOT NULL,
      location TEXT NOT NULL,
      preferred_date TEXT NOT NULL,
      message TEXT,
      status TEXT CHECK(status IN ('pending', 'claimed', 'approved', 'rejected')) DEFAULT 'pending',
      submitted_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_code TEXT UNIQUE NOT NULL,
      project_name TEXT NOT NULL,
      client_name TEXT,
      budget REAL,
      start_date TEXT,
      estimated_finish TEXT,
      status TEXT CHECK(status IN ('pending', 'on_progress', 'done', 'on_hold')) DEFAULT 'pending',
      created_by INTEGER,
      client_id INTEGER,
      marketing_id INTEGER,
      engineer_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (marketing_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (engineer_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  try { await run('ALTER TABLE projects ADD COLUMN client_id INTEGER REFERENCES users(id) ON DELETE SET NULL'); } catch(e){}
  try { await run('ALTER TABLE projects ADD COLUMN marketing_id INTEGER REFERENCES users(id) ON DELETE SET NULL'); } catch(e){}
  try { await run('ALTER TABLE projects ADD COLUMN engineer_id INTEGER REFERENCES users(id) ON DELETE SET NULL'); } catch(e){}

  await run(`
    CREATE TABLE IF NOT EXISTS project_stages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sequence INTEGER NOT NULL,
      status TEXT CHECK(status IN ('pending', 'in_progress', 'done')) DEFAULT 'pending',
      updated_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS stage_updates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stage_id INTEGER NOT NULL,
      description TEXT NOT NULL,
      progress INTEGER CHECK(progress BETWEEN 0 AND 100),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (stage_id) REFERENCES project_stages(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS project_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      stage_id INTEGER,
      file_name TEXT NOT NULL,
      file_url TEXT NOT NULL,
      file_type TEXT CHECK(file_type IN ('image', 'report', 'invoice', 'drawing', 'contract', 'video', 'other')) NOT NULL,
      uploaded_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (stage_id) REFERENCES project_stages(id) ON DELETE SET NULL,
      FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  console.log('Database tables successfully initialized.');

  // Opt-in: sebelumnya blok ini berjalan otomatis dan membuat akun
  // admin@grahasurvei.com / password123 di setiap server yang tabelnya kosong.
  if (process.env.SEED_DEFAULT_DATA !== 'true') {
    return;
  }

  const userCount = await get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    console.log('Seeding initial data (diminta via SEED_DEFAULT_DATA=true)...');
    
    const seedPassword = process.env.SEED_DEFAULT_PASSWORD;
    if (!seedPassword) {
      console.warn('[SEED] SEED_DEFAULT_DATA=true tetapi SEED_DEFAULT_PASSWORD tidak diset. Seeding dibatalkan.');
      return;
    }
    const passHash = await bcrypt.hash(seedPassword, 10);
    
    const adminId = (await run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Admin GSI', 'admin@grahasurvei.com', passHash, 'admin']
    )).lastID;
    
    await run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Rian Marketing', 'marketing@grahasurvei.com', passHash, 'marketing']
    );
    
    const engineerId = (await run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Heri Engineer', 'engineer@grahasurvei.com', passHash, 'engineer']
    )).lastID;
    
    await run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Budi Klien', 'client@client.com', passHash, 'client']
    );

    const projectId = (await run(`
      INSERT INTO projects (project_code, project_name, client_name, budget, start_date, estimated_finish, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PRJ-JEMBATAN-A', 'Monitoring Jembatan A', 'PT Pembangunan Jaya', 250000000, '2026-07-01', '2026-08-31', 'on_progress', adminId]
    )).lastID;

    const stages = [
      { title: 'Penawaran Disetujui', desc: 'Negosiasi kontrak dan tanda tangan MoU', seq: 1, status: 'done' },
      { title: 'Survey Lokasi', desc: 'Pengukuran geometris jembatan', seq: 2, status: 'done' },
      { title: 'Pengadaan Material', desc: 'Pembelian sensor SHMS dari supplier', seq: 3, status: 'done' },
      { title: 'Instalasi Sensor', desc: 'Pemasangan sensor regangan dan getar', seq: 4, status: 'in_progress' },
      { title: 'Pengujian', desc: 'Uji pembebanan dinamis jembatan', seq: 5, status: 'pending' },
      { title: 'Serah Terima', desc: 'Penyerahan laporan akhir dan invoice', seq: 6, status: 'pending' }
    ];

    for (const stage of stages) {
      await run(`
        INSERT INTO project_stages (project_id, title, description, sequence, status, updated_by)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [projectId, stage.title, stage.desc, stage.seq, stage.status, engineerId]
      );
    }

    console.log('Seeding completed successfully.');
  }
}

module.exports = {
  db,
  run,
  get,
  all,
  initDatabase
};
