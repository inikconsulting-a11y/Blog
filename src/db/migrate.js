const db = require('../config/db');

const statements = [
  `CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS photographer_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studio_name TEXT,
    logo_path TEXT,
    profile_photo_path TEXT,
    bio TEXT,
    whatsapp_number TEXT,
    email TEXT,
    social_links_json TEXT,
    address TEXT,
    hero_banner_path TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    cover_image_path TEXT,
    display_order INTEGER DEFAULT 0,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS service_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER NOT NULL,
    section_type TEXT NOT NULL,
    title TEXT,
    content TEXT,
    price_label TEXT,
    image_path TEXT,
    display_order INTEGER DEFAULT 0,
    FOREIGN KEY(service_id) REFERENCES services(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS portfolio_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_order INTEGER DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    event_date TEXT,
    location TEXT,
    cover_photo_path TEXT,
    is_published INTEGER DEFAULT 0,
    public_token TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES portfolio_categories(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS album_photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER NOT NULL,
    photo_path TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS blog_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT,
    featured_image_path TEXT,
    is_published INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES blog_categories(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
];

statements.forEach((sql) => db.prepare(sql).run());
console.log('Migrations completed.');
