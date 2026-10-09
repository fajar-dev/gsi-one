const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'gsi_one.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking local SQLite database for registered users...');
console.log(`Database Path: ${dbPath}`);

db.serialize(() => {
  db.all('SELECT id, name, email, role, created_at FROM users', [], (err, rows) => {
    if (err) {
      console.error('❌ Error reading users table:', err.message);
      return;
    }

    console.log(`\nFound ${rows.length} users in local SQLite:`);
    console.log(JSON.stringify(rows, null, 2));
  });
  
  db.all('SELECT id, name, email, phone, service_type, preferred_date FROM bookings', [], (err, rows) => {
    if (err) {
      console.error('❌ Error reading bookings table:', err.message);
      return;
    }

    console.log(`\nFound ${rows.length} bookings in local SQLite:`);
    console.log(JSON.stringify(rows, null, 2));
  });
});

db.close();
