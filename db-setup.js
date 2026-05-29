const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const setup = async () => {
  try {
    console.log('Setting up EduTrack multi-tenant database...');

    // Colleges table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        logo TEXT,
        primary_color VARCHAR(10) DEFAULT '#1B1F8A',
        secondary_color VARCHAR(10) DEFAULT '#E91E8C',
        accent_color VARCHAR(10) DEFAULT '#8DC63F',
        dhet_number VARCHAR(50),
        subscription_status VARCHAR(20) DEFAULT 'active',
        subscription_amount NUMERIC(10,2) DEFAULT 2500,
        next_payment_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Campuses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campuses (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
        name VARCHAR(200) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        campus VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Students table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
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

    // Marks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS marks (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
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

    // Finance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS finance (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
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

    // Attendance table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        college_id INTEGER REFERENCES colleges(id),
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

    // Super admin table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS super_admins (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Insert SA Shepherd College
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const superPassword = await bcrypt.hash('edutrack2025', 10);

    // Super admin
    await pool.query(`
      INSERT INTO super_admins (name, email, password)
      VALUES ('EduTrack Super Admin', 'superadmin@edutrack.co.za', $1)
      ON CONFLICT (email) DO NOTHING;
    `, [superPassword]);

    // SA Shepherd College
    const collegeResult = await pool.query(`
      INSERT INTO colleges (
        name, slug, email, phone, address,
        primary_color, secondary_color, accent_color,
        dhet_number, subscription_status, subscription_amount
      ) VALUES (
        'SA Shepherd College',
        'sashepherd',
        'admin@sashepherdcollege.org.za',
        '010 055 5115',
        'Main Road, RCS Building, Burgersfort',
        '#1B1F8A', '#E91E8C', '#8DC63F',
        '6999 926 54', 'active', 2500
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id;
    `);

    let collegeId = collegeResult.rows[0]?.id;

    if (!collegeId) {
      const existing = await pool.query(`SELECT id FROM colleges WHERE slug = 'sashepherd'`);
      collegeId = existing.rows[0]?.id;
    }

    // SA Shepherd campuses
    await pool.query(`
      INSERT INTO campuses (college_id, name, address, phone)
      VALUES
        ($1, 'Burgersfort Campus', 'Main Road, RCS Building Between CashBuild and Caltex', '010 055 5115'),
        ($1, 'Polokwane Campus', '17 Rissik Street CNR Landros Mare', '015 008 5102')
      ON CONFLICT DO NOTHING;
    `, [collegeId]);

    // SA Shepherd admins
    await pool.query(`
      INSERT INTO admins (college_id, name, email, password, role, campus)
      VALUES
        ($1, 'Burgersfort Admin', 'burgersfort@sashepherdcollege.org.za', $2, 'admin', 'Burgersfort Campus'),
        ($1, 'Polokwane Admin', 'polokwane@sashepherdcollege.org.za', $2, 'admin', 'Polokwane Campus'),
        ($1, 'Super Admin SASC', 'admin@sashepherdcollege.org.za', $2, 'superadmin', 'All Campuses')
      ON CONFLICT (email) DO NOTHING;
    `, [collegeId, adminPassword]);

    console.log('✅ All tables created successfully');
    console.log('✅ SA Shepherd College added');
    console.log('✅ Admin accounts created');
    console.log('');
    console.log('=================================');
    console.log('SUPER ADMIN LOGIN:');
    console.log('Email: superadmin@edutrack.co.za');
    console.log('Password: edutrack2025');
    console.log('');
    console.log('SA SHEPHERD ADMIN LOGIN:');
    console.log('Email: admin@sashepherdcollege.org.za');
    console.log('Password: admin123');
    console.log('=================================');
    process.exit(0);
  } catch (err) {
    console.error('Setup error:', err.message);
    process.exit(1);
  }
};

setup();