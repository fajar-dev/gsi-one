
'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { initDatabase } = require('./database');
const { uploadsDir } = require('./config/multer');

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const fileRoutes = require('./routes/fileRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

if (!process.env.JWT_SECRET) {
  console.error('[FATAL] Variabel environment JWT_SECRET wajib diset. Server tidak dapat dijalankan tanpa nilai ini.');
  console.error('[FATAL] Salin file .env.example menjadi .env dan isi nilai JWT_SECRET.');
  process.exit(1);
}

const app = express();
app.disable('x-powered-by'); 
app.use(helmet());           

const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'https://grahasurvei.com',
  'http://localhost:3000',
  'http://10.0.2.2:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`[CORS SECURITY AUDIT] Akses ditolak untuk origin: ${origin}`);
      callback(new Error('Akses CORS ditolak: origin tidak diizinkan'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.use('/uploads', express.static(uploadsDir, {
  maxAge: '7d',
  immutable: true,
}));

app.use('/api', authRoutes);
app.use('/api', projectRoutes);
app.use('/api', bookingRoutes);
app.use('/api', fileRoutes);
app.use('/api', notificationRoutes);

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\nGSI One Server is running on port ${PORT}`);
      console.log(`Environment base URL: http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize database and start server:', err);
    process.exit(1);
  }
}

startServer();
