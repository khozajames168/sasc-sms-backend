const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'sasc-secret-key');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// ==================== AUTH ROUTES ====================

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET || 'sasc-secret-key',
      { expiresIn: '8h' }
    );
    res.json({ token, admin: { id: admin.id, email: admin.email, name: admin.name, campus: admin.campus } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student Login
app.post('/api/auth/student-login', async (req, res) => {
  try {
    const { studentNumber, password } = req.body;
    const result = await pool.query('SELECT * FROM students WHERE student_number = $1', [studentNumber]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid student number or password' });
    }
    const student = result.rows[0];
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid student number or password' });
    }
    const token = jwt.sign(
      { id: student.id, studentNumber: student.student_number, role: 'student' },
      process.env.JWT_SECRET || 'sasc-secret-key',
      { expiresIn: '8h' }
    );
    res.json({ token, student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== STUDENT ROUTES ====================

// Get all students
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM students ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single student
app.get('/api/students/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new student
app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const {
      title, firstName, lastName, idNumber, dateOfBirth, maritalStatus,
      gender, homeLanguage, address, homeTel, cellNumber, email,
      isSACitizen, passportNumber, faculty, course, campus, studyMode,
      accommodation, previousSchool, qualificationObtained, subjects,
      payerType, payerName, payerIdNumber, payerAddress, payerCell,
      hearAboutUs, deposit, monthly, total, duration, photo
    } = req.body;

    const year = new Date().getFullYear();
    const countResult = await pool.query('SELECT COUNT(*) FROM students WHERE EXTRACT(YEAR FROM created_at) = $1', [year]);
    const count = parseInt(countResult.rows[0].count) + 1;
    const studentNumber = `SASC-${year}-${String(count).padStart(4, '0')}`;

    const hashedPassword = await bcrypt.hash(idNumber.slice(-6), 10);

    const result = await pool.query(`
      INSERT INTO students (
        student_number, title, first_name, last_name, id_number,
        date_of_birth, marital_status, gender, home_language,
        address, home_tel, cell_number, email, is_sa_citizen,
        passport_number, faculty, course, campus, study_mode,
        accommodation, previous_school, qualification_obtained,
        subjects, payer_type, payer_name, payer_id_number,
        payer_address, payer_cell, hear_about_us, deposit,
        monthly_fee, total_fee, duration, photo, password, status
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,
        $16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,
        $29,$30,$31,$32,$33,$34,$35,$36
      ) RETURNING *`,
      [
        studentNumber, title, firstName, lastName, idNumber,
        dateOfBirth, maritalStatus, gender, homeLanguage,
        address, homeTel, cellNumber, email, isSACitizen,
        passportNumber, faculty, course, campus, studyMode,
        accommodation, previousSchool, qualificationObtained,
        subjects, payerType, payerName, payerIdNumber,
        payerAddress, payerCell, hearAboutUs, deposit,
        monthly, total, duration, photo, hashedPassword, 'Active'
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== MARKS ROUTES ====================

// Get marks for a course
app.get('/api/marks/:course', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM marks WHERE course = $1 ORDER BY created_at DESC',
      [decodeURIComponent(req.params.course)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save marks
app.post('/api/marks', authenticateToken, async (req, res) => {
  try {
    const { studentId, studentNumber, studentName, course, subject, term, mark } = req.body;
    const result = await pool.query(`
      INSERT INTO marks (student_id, student_number, student_name, course, subject, term, mark)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (student_number, course, subject, term)
      DO UPDATE SET mark = $7, updated_at = NOW()
      RETURNING *`,
      [studentId, studentNumber, studentName, course, subject, term, mark]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== FINANCE ROUTES ====================

// Get all finance records
app.get('/api/finance', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Record payment
app.post('/api/finance/payment', authenticateToken, async (req, res) => {
  try {
    const { studentId, studentNumber, studentName, amount, paymentMethod, reference } = req.body;
    const receiptNumber = `REC-${Date.now()}`;
    const result = await pool.query(`
      INSERT INTO finance (student_id, student_number, student_name, amount, payment_method, reference, receipt_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [studentId, studentNumber, studentName, amount, paymentMethod, reference, receiptNumber]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ATTENDANCE ROUTES ====================

// Get attendance
app.get('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save attendance
app.post('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { studentId, studentNumber, studentName, course, campus, date, status } = req.body;
    const result = await pool.query(`
      INSERT INTO attendance (student_id, student_number, student_name, course, campus, date, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (student_number, course, date)
      DO UPDATE SET status = $7, updated_at = NOW()
      RETURNING *`,
      [studentId, studentNumber, studentName, course, campus, date, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DASHBOARD STATS ====================

app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const students = await pool.query('SELECT COUNT(*) FROM students');
    const activeStudents = await pool.query("SELECT COUNT(*) FROM students WHERE status = 'Active'");
    const totalFees = await pool.query('SELECT SUM(total_fee) FROM students');
    const totalPaid = await pool.query('SELECT SUM(amount) FROM finance');
    const burgersfort = await pool.query("SELECT COUNT(*) FROM students WHERE campus = 'Burgersfort Campus'");
    const polokwane = await pool.query("SELECT COUNT(*) FROM students WHERE campus = 'Polokwane Campus'");

    res.json({
      totalStudents: parseInt(students.rows[0].count),
      activeStudents: parseInt(activeStudents.rows[0].count),
      totalFees: parseFloat(totalFees.rows[0].sum || 0),
      totalPaid: parseFloat(totalPaid.rows[0].sum || 0),
      burgersfort: parseInt(burgersfort.rows[0].count),
      polokwane: parseInt(polokwane.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'SA Shepherd College SMS API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 SA Shepherd College SMS Server running on port ${PORT}`);
});