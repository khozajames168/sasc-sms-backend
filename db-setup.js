const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const setup = async () => {
  try {
    console.log('Setting up SA Shepherd College database...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        campus VARCHAR(100),
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        student_number VARCHAR(20) UNIQUE NOT NULL,
        title VARCHAR(10),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        id_number VARCHAR(20),
        date_of_birth DATE,
        marital_status VARCHAR(20),
        gender VARCHAR(20),
        home_language VARCHAR(50),
        address TEXT,
        home_tel VARCHAR(20),
        cell_number VARCHAR(20),
        email VARCHAR(100),
        is_sa_citizen VARCHAR(5) DEFAULT 'Yes',
        passport_number VARCHAR(20),
        faculty VARCHAR(100),
        course VARCHAR(200),
        campus VARCHAR(100),
        study_mode VARCHAR(50),
        accommodation VARCHAR(50),
        previous_school VARCHAR(200),
        qualification_obtained VARCHAR(200),
        subjects TEXT,
        payer_type VARCHAR(50),
        payer_name VARCHAR(200),
        payer_id_number VARCHAR(20),
        payer_address TEXT,
        payer_cell VARCHAR(20),
        hear_about_us VARCHAR(100),
        deposit NUMERIC(10,2),
        monthly_fee NUMERIC(10,2),
        total_fee NUMERIC(10,2),
        duration VARCHAR(50),
        photo TEXT,
        password VARCHAR(255),
        status VARCHAR(20) DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        student_number VARCHAR(20),
        student_name VARCHAR(200),
        course VARCHAR(200),
        subject VARCHAR(200),
        term VARCHAR(20),
        mark NUMERIC(5,2),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(student_number, course, subject, term)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS finance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        student_number VARCHAR(20),
        student_name VARCHAR(200),
        amount NUMERIC(10,2),
        payment_method VARCHAR(50),
        reference VARCHAR(100),
        receipt_number VARCHAR(50) UNIQUE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        student_number VARCHAR(20),
        student_name VARCHAR(200),
        course VARCHAR(200),
        campus VARCHAR(100),
        date DATE,
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(student_number, course, date)
      );
    `);

    // Create default admin accounts
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);

    await pool.query(`
      INSERT INTO admins (name, email, password, campus)
      VALUES
        ('Burgersfort Admin', 'burgersfort@sashepherdcollege.org.za', $1, 'Burgersfort Campus'),
        ('Polokwane Admin', 'polokwane@sashepherdcollege.org.za', $1, 'Polokwane Campus'),
        ('Super Admin', 'admin@sashepherdcollege.org.za', $1, 'All Campuses')
      ON CONFLICT (email) DO NOTHING;
    `, [adminPassword]);

    console.log('✅ All tables created successfully');
    console.log('✅ Default admin accounts created');
    console.log('');
    console.log('Admin Logins:');
    console.log('Email: admin@sashepherdcollege.org.za');
    console.log('Password: admin123');
    console.log('');
    process.exit(0);
  } catch (err) {
    console.error('Setup error:', err.message);
    process.exit(1);
  }
};

setup();