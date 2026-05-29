const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Running role-based access migration...');

    // Add role column to admins if not exists
    await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin'`);
    
    // Add permissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        college_id INTEGER,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'admin',
        campus VARCHAR(100),
        can_register BOOLEAN DEFAULT true,
        can_view_students BOOLEAN DEFAULT true,
        can_capture_marks BOOLEAN DEFAULT true,
        can_view_finance BOOLEAN DEFAULT true,
        can_edit_finance BOOLEAN DEFAULT false,
        can_take_attendance BOOLEAN DEFAULT true,
        can_export BOOLEAN DEFAULT true,
        can_communicate BOOLEAN DEFAULT true,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Add session tracking
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER,
        college_id INTEGER,
        token TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '8 hours',
        last_activity TIMESTAMP DEFAULT NOW()
      )
    `);

    // Add notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        college_id INTEGER,
        title VARCHAR(200),
        message TEXT,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Add invoices table for payment system
    await pool.query(`
      CREATE TABLE IF NOT EXISTS invoices (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
        invoice_number VARCHAR(50) UNIQUE NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(20) DEFAULT 'unpaid',
        due_date DATE,
        paid_date DATE,
        payment_method VARCHAR(50),
        payment_reference VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const bcrypt = require('bcryptjs');
    
    // Add lecturer and principal for SA Shepherd
    const college = await pool.query(`SELECT id FROM colleges WHERE slug = 'sashepherd'`);
    const collegeId = college.rows[0]?.id;

    if (collegeId) {
      const lecturerPassword = await bcrypt.hash('lecturer123', 10);
      const principalPassword = await bcrypt.hash('principal123', 10);

      await pool.query(`
        INSERT INTO admins (college_id, name, email, password, role, campus)
        VALUES
          ($1, 'Lecturer Account', 'lecturer@sashepherdcollege.org.za', $2, 'lecturer', 'Burgersfort Campus'),
          ($1, 'Principal Account', 'principal@sashepherdcollege.org.za', $3, 'principal', 'All Campuses')
        ON CONFLICT (email) DO NOTHING
      `, [collegeId, lecturerPassword, principalPassword]);

      // Generate first invoice for SA Shepherd
      await pool.query(`
        INSERT INTO invoices (college_id, invoice_number, amount, status, due_date)
        VALUES ($1, 'INV-2025-001', 2500, 'paid', '2025-01-31')
        ON CONFLICT (invoice_number) DO NOTHING
      `, [collegeId]);
    }

    console.log('✅ Role-based access migration complete');
    console.log('✅ Lecturer login: lecturer@sashepherdcollege.org.za / lecturer123');
    console.log('✅ Principal login: principal@sashepherdcollege.org.za / principal123');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
};

migrate();