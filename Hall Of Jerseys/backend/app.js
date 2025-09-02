// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');

// DB connection (will attach connection to req.db)
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

// Static (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Create DB connection and attach to request
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'HallofJerseys',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// simple ping to ensure connection works (non-blocking)
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erro ao conectar no MySQL:', err.message || err);
  } else {
    console.log('✅ Pool MySQL pronto.');
    if (connection) connection.release();
  }
});

// make db available in requests
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes (you can expand these files)
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API Hall of Jerseys funcionando 🚀' });
});

module.exports = app;
