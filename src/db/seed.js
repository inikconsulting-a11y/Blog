require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const email = process.env.ADMIN_EMAIL || 'admin@studio.com';
const password = process.env.ADMIN_PASSWORD || 'admin1234';
const exists = db.prepare('SELECT id FROM admins WHERE email = ?').get(email);
if (!exists) {
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO admins (email, password_hash) VALUES (?, ?)').run(email, hash);
  console.log(`Admin created: ${email}`);
}

const profile = db.prepare('SELECT id FROM photographer_profile LIMIT 1').get();
if (!profile) {
  db.prepare(`INSERT INTO photographer_profile 
    (studio_name, bio, whatsapp_number, email, social_links_json, address)
    VALUES (?, ?, ?, ?, ?, ?)`)
    .run(
      'Studio Lumière',
      'Photographe événementiel premium (mariages, anniversaires, corporate).',
      '+221770000000',
      'contact@studiolumiere.com',
      JSON.stringify({ instagram: '', facebook: '', tiktok: '' }),
      'Dakar, Sénégal'
    );
}

console.log('Seed completed.');
