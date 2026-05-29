const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrate = async () => {
  try {
    console.log('Running migrations...');

    await pool.query(`CREATE TABLE IF NOT EXISTS colleges (
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
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS campuses (
      id SERIAL PRIMARY KEY,
      college_id INTEGER,
      name VARCHAR(200) NOT NULL,
      address TEXT,
      phone VARCHAR(20),
      email VARCHAR(100),
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await pool.query(`CREATE TABLE IF NOT EXISTS super_admins (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )`);

    await pool.query(`ALTER TABLE admins ADD COLUMN IF NOT EXISTS college_id INTEGER`);
    await pool.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS college_id INTEGER`);
    await pool.query(`ALTER TABLE marks ADD COLUMN IF NOT EXISTS college_id INTEGER`);
    await pool.query(`ALTER TABLE finance ADD COLUMN IF NOT EXISTS college_id INTEGER`);
    await pool.query(`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS college_id INTEGER`);

    const bcrypt = require('bcryptjs');
    const superPassword = await bcrypt.hash('edutrack2025', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);

    await pool.query(`
      INSERT INTO super_admins (name, email, password)
      VALUES ('EduTrack Super Admin', 'superadmin@edutrack.co.za', $1)
      ON CONFLICT (email) DO NOTHING
    `, [superPassword]);

    const collegeResult = await pool.query(`
      INSERT INTO colleges (name, slug, email, phone, address, primary_color, secondary_color, accent_color, dhet_number, subscription_status, subscription_amount)
      VALUES ('SA Shepherd College', 'sashepherd', 'admin@sashepherdcollege.org.za', '010 055 5115', 'Main Road, RCS Building, Burgersfort', '#1B1F8A', '#E91E8C', '#8DC63F', '6999 926 54', 'active', 2500)
      ON CONFLICT (slug) DO NOTHING
      RETURNING id
    `);

    let collegeId = collegeResult.rows[0]?.id;
    if (!collegeId) {
      const existing = await pool.query(`SELECT id FROM colleges WHERE slug = 'sashepherd'`);
      collegeId = existing.rows[0]?.id;
    }

    await pool.query(`
      INSERT INTO campuses (college_id, name, address, phone)
      VALUES
        ($1, 'Burgersfort Campus', 'Main Road, RCS Building', '010 055 5115'),
        ($1, 'Polokwane Campus', '17 Rissik Street CNR Landros Mare', '015 008 5102')
      ON CONFLICT DO NOTHING
    `, [collegeId]);

    await pool.query(`UPDATE admins SET college_id = $1 WHERE college_id IS NULL`, [collegeId]);
    await pool.query(`UPDATE students SET college_id = $1 WHERE college_id IS NULL`, [collegeId]);
    await pool.query(`UPDATE marks SET college_id = $1 WHERE college_id IS NULL`, [collegeId]);
    await pool.query(`UPDATE finance SET college_id = $1 WHERE college_id IS NULL`, [collegeId]);
    await pool.query(`UPDATE attendance SET college_id = $1 WHERE college_id IS NULL`, [collegeId]);

    console.log('✅ Migration complete!');
    console.log('✅ SA Shepherd College ID:', collegeId);
    console.log('');
    console.log('SUPER ADMIN: superadmin@edutrack.co.za / edutrack2025');
    console.log('SASC ADMIN: admin@sashepherdcollege.org.za / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err.message);
    process.exit(1);
  }
};

migrate();