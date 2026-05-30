const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Adding course assignment to admins...');

    await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS assigned_course VARCHAR(200)`);
    await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN DEFAULT true`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS deregistration_requested BOOLEAN DEFAULT false`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS deregistration_reason TEXT`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS deregistration_status VARCHAR(20) DEFAULT 'active'`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(100)`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS deregistration_requests (
        id SERIAL PRIMARY KEY,
        college_id INTEGER,
        student_id INTEGER REFERENCES students(id),
        student_number VARCHAR(20),
        student_name VARCHAR(200),
        reason TEXT,
        requested_by VARCHAR(50) DEFAULT 'student',
        status VARCHAR(20) DEFAULT 'pending',
        approved_by VARCHAR(100),
        approved_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessments (
        id SERIAL PRIMARY KEY,
        college_id INTEGER,
        course VARCHAR(200),
        subject VARCHAR(200),
        title VARCHAR(200),
        type VARCHAR(50),
        weight NUMERIC(5,2),
        max_mark NUMERIC(5,2),
        due_date DATE,
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assessment_results (
        id SERIAL PRIMARY KEY,
        assessment_id INTEGER REFERENCES assessments(id),
        student_id INTEGER REFERENCES students(id),
        student_number VARCHAR(20),
        student_name VARCHAR(200),
        mark NUMERIC(5,2),
        created_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(assessment_id, student_number)
      )
    `);

    // Update lecturer with assigned course
    await pool.query(`
      UPDATE admins SET assigned_course = 'Electrical Engineering N1-N6', must_change_password = true
      WHERE email = 'lecturer@sashepherdcollege.org.za'
    `);

    // Set must_change_password for all non-superadmin
    await pool.query(`UPDATE admins SET must_change_password = true WHERE must_change_password IS NULL`);

    console.log('✅ Migration complete');
    console.log('✅ Course assignment added');
    console.log('✅ Deregistration tables created');
    console.log('✅ Assessment tables created');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
};

migrate();