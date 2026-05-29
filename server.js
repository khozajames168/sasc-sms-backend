const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect((err, client, release) => {
  if (err) console.error('Database connection error:', err.message);
  else { console.log('✅ Database connected'); release(); }
});

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

const authenticateSuperAdmin = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'sasc-secret-key');
    if (verified.role !== 'superadmin') return res.status(403).json({ error: 'Super admin access required' });
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// AUTH
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid email or password' });
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid email or password' });
    const college = await pool.query('SELECT * FROM colleges WHERE id = $1', [admin.college_id]);
    const campuses = await pool.query('SELECT * FROM campuses WHERE college_id = $1', [admin.college_id]);
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role, collegeId: admin.college_id, campus: admin.campus },
      process.env.JWT_SECRET || 'sasc-secret-key',
      { expiresIn: '8h' }
    );
    try {
      await pool.query(`INSERT INTO sessions (admin_id, college_id, token, expires_at) VALUES ($1, $2, $3, NOW() + INTERVAL '8 hours')`, [admin.id, admin.college_id, token]);
    } catch (e) {}
    res.json({
      token,
      admin: { ...admin, password: undefined },
      college: { ...college.rows[0], campuses: campuses.rows },
      role: admin.role,
      permissions: {
        canRegister: ['admin', 'superadmin'].includes(admin.role),
        canViewStudents: true,
        canCaptureMarks: ['admin', 'superadmin', 'lecturer'].includes(admin.role),
        canViewFinance: ['admin', 'superadmin', 'principal'].includes(admin.role),
        canEditFinance: ['admin', 'superadmin'].includes(admin.role),
        canTakeAttendance: ['admin', 'superadmin', 'lecturer'].includes(admin.role),
        canExport: ['admin', 'superadmin', 'principal'].includes(admin.role),
        canCommunicate: ['admin', 'superadmin'].includes(admin.role),
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/student-login', async (req, res) => {
  try {
    const { studentNumber, password } = req.body;
    const result = await pool.query('SELECT * FROM students WHERE student_number = $1', [studentNumber]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid student number or password' });
    const student = result.rows[0];
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid student number or password' });
    const token = jwt.sign(
      { id: student.id, studentNumber: student.student_number, role: 'student', collegeId: student.college_id },
      process.env.JWT_SECRET || 'sasc-secret-key',
      { expiresIn: '8h' }
    );
    res.json({ token, student: { ...student, password: undefined } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/super-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM super_admins WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const admin = result.rows[0];
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'superadmin' },
      process.env.JWT_SECRET || 'sasc-secret-key',
      { expiresIn: '8h' }
    );
    res.json({ token, admin: { ...admin, password: undefined } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUPER ADMIN
app.get('/api/super/colleges', authenticateSuperAdmin, async (req, res) => {
  try {
    const colleges = await pool.query('SELECT * FROM colleges ORDER BY created_at DESC');
    const stats = await Promise.all(colleges.rows.map(async (college) => {
      const students = await pool.query('SELECT COUNT(*) FROM students WHERE college_id = $1', [college.id]);
      const revenue = await pool.query('SELECT SUM(amount) FROM finance WHERE college_id = $1', [college.id]);
      return { ...college, studentCount: parseInt(students.rows[0].count), totalRevenue: parseFloat(revenue.rows[0].sum || 0) };
    }));
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/super/colleges', authenticateSuperAdmin, async (req, res) => {
  try {
    const { name, slug, email, phone, address, primaryColor, secondaryColor, accentColor, dhetNumber, subscriptionAmount, adminName, adminEmail, adminPassword, campus1Name, campus1Address, campus1Phone, campus2Name, campus2Address, campus2Phone } = req.body;
    const collegeResult = await pool.query(`INSERT INTO colleges (name, slug, email, phone, address, primary_color, secondary_color, accent_color, dhet_number, subscription_amount) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`, [name, slug, email, phone, address, primaryColor || '#1B1F8A', secondaryColor || '#E91E8C', accentColor || '#8DC63F', dhetNumber, subscriptionAmount || 2500]);
    const college = collegeResult.rows[0];
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await pool.query(`INSERT INTO admins (college_id, name, email, password, role, campus) VALUES ($1, $2, $3, $4, 'admin', 'All Campuses')`, [college.id, adminName, adminEmail, hashedPassword]);
    if (campus1Name) await pool.query(`INSERT INTO campuses (college_id, name, address, phone) VALUES ($1, $2, $3, $4)`, [college.id, campus1Name, campus1Address, campus1Phone]);
    if (campus2Name) await pool.query(`INSERT INTO campuses (college_id, name, address, phone) VALUES ($1, $2, $3, $4)`, [college.id, campus2Name, campus2Address, campus2Phone]);
    res.status(201).json({ college, message: 'College created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/super/stats', authenticateSuperAdmin, async (req, res) => {
  try {
    const colleges = await pool.query('SELECT COUNT(*) FROM colleges');
    const students = await pool.query('SELECT COUNT(*) FROM students');
    const revenue = await pool.query('SELECT SUM(amount) FROM finance');
    const activeColleges = await pool.query("SELECT COUNT(*) FROM colleges WHERE subscription_status = 'active'");
    res.json({ totalColleges: parseInt(colleges.rows[0].count), totalStudents: parseInt(students.rows[0].count), totalRevenue: parseFloat(revenue.rows[0].sum || 0), activeColleges: parseInt(activeColleges.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/super/colleges/:id/status', authenticateSuperAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await pool.query('UPDATE colleges SET subscription_status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/super/invoices', authenticateSuperAdmin, async (req, res) => {
  try {
    const result = await pool.query(`SELECT i.*, c.name as college_name FROM invoices i JOIN colleges c ON i.college_id = c.id ORDER BY i.created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/super/invoices', authenticateSuperAdmin, async (req, res) => {
  try {
    const { collegeId, amount, dueDate } = req.body;
    const count = await pool.query('SELECT COUNT(*) FROM invoices WHERE college_id = $1', [collegeId]);
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(parseInt(count.rows[0].count) + 1).padStart(3, '0')}`;
    const result = await pool.query(`INSERT INTO invoices (college_id, invoice_number, amount, status, due_date) VALUES ($1, $2, $3, 'unpaid', $4) RETURNING *`, [collegeId, invoiceNumber, amount, dueDate]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/super/invoices/:id/pay', authenticateSuperAdmin, async (req, res) => {
  try {
    const { paymentMethod, reference } = req.body;
    await pool.query(`UPDATE invoices SET status = 'paid', paid_date = NOW(), payment_method = $1, payment_reference = $2 WHERE id = $3`, [paymentMethod, reference, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STUDENTS
app.get('/api/students', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students WHERE college_id = $1 ORDER BY created_at DESC', [req.user.collegeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', authenticateToken, async (req, res) => {
  try {
    const { title, firstName, lastName, idNumber, dateOfBirth, maritalStatus, gender, homeLanguage, address, homeTel, cellNumber, email, isSACitizen, passportNumber, faculty, course, campus, studyMode, accommodation, previousSchool, qualificationObtained, subjects, payerType, payerName, payerIdNumber, payerAddress, payerCell, hearAboutUs, deposit, monthly, total, duration, photo } = req.body;
    const collegeId = req.user.collegeId;
    const year = new Date().getFullYear();
    const countResult = await pool.query('SELECT COUNT(*) FROM students WHERE college_id = $1 AND EXTRACT(YEAR FROM created_at) = $2', [collegeId, year]);
    const count = parseInt(countResult.rows[0].count) + 1;
    const college = await pool.query('SELECT slug FROM colleges WHERE id = $1', [collegeId]);
    const prefix = college.rows[0]?.slug?.toUpperCase().substring(0, 4) || 'SASC';
    const studentNumber = `${prefix}-${year}-${String(count).padStart(4, '0')}`;
    const hashedPassword = await bcrypt.hash(idNumber.slice(-6), 10);
    const result = await pool.query(`INSERT INTO students (college_id, student_number, title, first_name, last_name, id_number, date_of_birth, marital_status, gender, home_language, address, home_tel, cell_number, email, is_sa_citizen, passport_number, faculty, course, campus, study_mode, accommodation, previous_school, qualification_obtained, subjects, payer_type, payer_name, payer_id_number, payer_address, payer_cell, hear_about_us, deposit, monthly_fee, total_fee, duration, photo, password, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37) RETURNING *`, [collegeId, studentNumber, title, firstName, lastName, idNumber, dateOfBirth, maritalStatus, gender, homeLanguage, address, homeTel, cellNumber, email, isSACitizen, passportNumber, faculty, course, campus, studyMode, accommodation, previousSchool, qualificationObtained, subjects, payerType, payerName, payerIdNumber, payerAddress, payerCell, hearAboutUs, deposit, monthly, total, duration, photo, hashedPassword, 'Active']);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MARKS
app.get('/api/marks/:course', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM marks WHERE college_id = $1 AND course = $2 ORDER BY created_at DESC', [req.user.collegeId, decodeURIComponent(req.params.course)]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/marks', authenticateToken, async (req, res) => {
  try {
    const { studentId, studentNumber, studentName, course, subject, term, mark } = req.body;
    const result = await pool.query(`INSERT INTO marks (college_id, student_id, student_number, student_name, course, subject, term, mark) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (student_number, course, subject, term) DO UPDATE SET mark = $8, updated_at = NOW() RETURNING *`, [req.user.collegeId, studentId, studentNumber, studentName, course, subject, term, mark]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FINANCE
app.get('/api/finance', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM finance WHERE college_id = $1 ORDER BY created_at DESC', [req.user.collegeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/finance/payment', authenticateToken, async (req, res) => {
  try {
    const { studentId, studentNumber, studentName, amount, paymentMethod, reference } = req.body;
    const receiptNumber = `REC-${Date.now()}`;
    const result = await pool.query(`INSERT INTO finance (college_id, student_id, student_number, student_name, amount, payment_method, reference, receipt_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [req.user.collegeId, studentId, studentNumber, studentName, amount, paymentMethod, reference, receiptNumber]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ATTENDANCE
app.get('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM attendance WHERE college_id = $1 ORDER BY date DESC', [req.user.collegeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/attendance', authenticateToken, async (req, res) => {
  try {
    const { studentId, studentNumber, studentName, course, campus, date, status } = req.body;
    const result = await pool.query(`INSERT INTO attendance (college_id, student_id, student_number, student_name, course, campus, date, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (student_number, course, date) DO UPDATE SET status = $8, updated_at = NOW() RETURNING *`, [req.user.collegeId, studentId, studentNumber, studentName, course, campus, date, status]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// STATS
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const collegeId = req.user.collegeId;
    const students = await pool.query('SELECT COUNT(*) FROM students WHERE college_id = $1', [collegeId]);
    const activeStudents = await pool.query("SELECT COUNT(*) FROM students WHERE college_id = $1 AND status = 'Active'", [collegeId]);
    const totalFees = await pool.query('SELECT SUM(total_fee) FROM students WHERE college_id = $1', [collegeId]);
    const totalPaid = await pool.query('SELECT SUM(amount) FROM finance WHERE college_id = $1', [collegeId]);
    const burgersfort = await pool.query("SELECT COUNT(*) FROM students WHERE college_id = $1 AND campus = 'Burgersfort Campus'", [collegeId]);
    const polokwane = await pool.query("SELECT COUNT(*) FROM students WHERE college_id = $1 AND campus = 'Polokwane Campus'", [collegeId]);
    res.json({ totalStudents: parseInt(students.rows[0].count), activeStudents: parseInt(activeStudents.rows[0].count), totalFees: parseFloat(totalFees.rows[0].sum || 0), totalPaid: parseFloat(totalPaid.rows[0].sum || 0), burgersfort: parseInt(burgersfort.rows[0].count), polokwane: parseInt(polokwane.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// COLLEGES
app.get('/api/colleges/:slug', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM colleges WHERE slug = $1', [req.params.slug]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'College not found' });
    const campuses = await pool.query('SELECT * FROM campuses WHERE college_id = $1', [result.rows[0].id]);
    res.json({ ...result.rows[0], campuses: campuses.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// NOTIFICATIONS
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM notifications WHERE college_id = $1 ORDER BY created_at DESC LIMIT 20', [req.user.collegeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await pool.query('UPDATE notifications SET is_read = true WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INVOICES
app.get('/api/invoices', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM invoices WHERE college_id = $1 ORDER BY created_at DESC', [req.user.collegeId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'EduTrack SMS API is running', version: '2.0' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 EduTrack SMS Server running on port ${PORT}`);
});