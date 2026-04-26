const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const db = require('../config/db');
const { makeSlug } = require('../utils/slug');
const { optimizeAndSave } = require('../utils/upload');

const AdminController = {
  loginForm(req, res) { res.render('admin/login', { error: null }); },
  login(req, res) {
    const { email, password } = req.body;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.render('admin/login', { error: 'Identifiants invalides' });
    }
    req.session.adminId = admin.id;
    return res.redirect('/admin');
  },
  logout(req, res) {
    req.session.destroy(() => res.redirect('/admin/login'));
  },
  dashboard(req, res) {
    const counts = {
      services: db.prepare('SELECT COUNT(*) as c FROM services').get().c,
      albums: db.prepare('SELECT COUNT(*) as c FROM albums').get().c,
      posts: db.prepare('SELECT COUNT(*) as c FROM blog_posts').get().c,
      messages: db.prepare('SELECT COUNT(*) as c FROM contact_messages WHERE is_read = 0').get().c
    };
    res.render('admin/dashboard', { counts });
  },
  services(req, res) {
    const services = db.prepare('SELECT * FROM services ORDER BY display_order, id DESC').all();
    res.render('admin/services', { services });
  },
  async createService(req, res) {
    const payload = {
      name: req.body.name,
      slug: makeSlug(req.body.name),
      short_description: req.body.short_description || '',
      cover_image_path: null,
      display_order: Number(req.body.display_order || 0),
      is_published: req.body.is_published ? 1 : 0
    };
    if (req.file) payload.cover_image_path = await optimizeAndSave(req.file, 'services');
    db.prepare(`INSERT INTO services(name, slug, short_description, cover_image_path, display_order, is_published)
      VALUES(@name,@slug,@short_description,@cover_image_path,@display_order,@is_published)`).run(payload);
    res.redirect('/admin/services');
  },
  portfolio(req, res) {
    const categories = db.prepare('SELECT * FROM portfolio_categories ORDER BY display_order').all();
    const albums = db.prepare('SELECT a.*, c.name as category_name FROM albums a LEFT JOIN portfolio_categories c ON a.category_id = c.id ORDER BY a.created_at DESC').all();
    res.render('admin/portfolio', { categories, albums });
  },
  createCategory(req, res) {
    db.prepare('INSERT INTO portfolio_categories(name, slug, display_order) VALUES(?,?,?)').run(req.body.name, makeSlug(req.body.name), Number(req.body.display_order || 0));
    res.redirect('/admin/portfolio');
  },
  async createAlbum(req, res) {
    const token = crypto.randomBytes(5).toString('hex');
    const slug = makeSlug(req.body.title);
    const result = db.prepare(`INSERT INTO albums(category_id,title,slug,description,event_date,location,is_published,public_token)
      VALUES(?,?,?,?,?,?,?,?)`).run(req.body.category_id || null, req.body.title, slug, req.body.description || '', req.body.event_date || null, req.body.location || '', req.body.is_published ? 1 : 0, token);
    if (req.files?.length) {
      for (const [i, file] of req.files.entries()) {
        const path = await optimizeAndSave(file, 'albums');
        db.prepare('INSERT INTO album_photos(album_id, photo_path, display_order) VALUES(?,?,?)').run(result.lastInsertRowid, path, i);
      }
      db.prepare('UPDATE albums SET cover_photo_path = ? WHERE id = ?').run(
        db.prepare('SELECT photo_path FROM album_photos WHERE album_id = ? ORDER BY id LIMIT 1').get(result.lastInsertRowid)?.photo_path || null,
        result.lastInsertRowid
      );
    }
    res.redirect('/admin/portfolio');
  },
  blog(req, res) {
    const categories = db.prepare('SELECT * FROM blog_categories ORDER BY name').all();
    const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
    res.render('admin/blog', { categories, posts });
  },
  createBlogCategory(req, res) {
    db.prepare('INSERT INTO blog_categories(name, slug) VALUES(?, ?)').run(req.body.name, makeSlug(req.body.name));
    res.redirect('/admin/blog');
  },
  async createPost(req, res) {
    let image = null;
    if (req.file) image = await optimizeAndSave(req.file, 'blog');
    db.prepare(`INSERT INTO blog_posts(category_id,title,slug,excerpt,content,featured_image_path,is_published)
      VALUES(?,?,?,?,?,?,?)`).run(req.body.category_id || null, req.body.title, makeSlug(req.body.title), req.body.excerpt || '', req.body.content || '', image, req.body.is_published ? 1 : 0);
    res.redirect('/admin/blog');
  },
  messages(req, res) {
    const messages = db.prepare('SELECT * FROM contact_messages ORDER BY created_at DESC').all();
    res.render('admin/messages', { messages });
  },
  toggleMessage(req, res) {
    const msg = db.prepare('SELECT is_read FROM contact_messages WHERE id = ?').get(req.params.id);
    db.prepare('UPDATE contact_messages SET is_read = ? WHERE id = ?').run(msg?.is_read ? 0 : 1, req.params.id);
    res.redirect('/admin/messages');
  },
  profile(req, res) {
    const profile = db.prepare('SELECT * FROM photographer_profile LIMIT 1').get();
    res.render('admin/profile', { profile });
  },
  async saveProfile(req, res) {
    const existing = db.prepare('SELECT * FROM photographer_profile LIMIT 1').get();
    const logo = req.files?.logo?.[0] ? await optimizeAndSave(req.files.logo[0], 'profile') : existing.logo_path;
    const profilePhoto = req.files?.profile_photo?.[0] ? await optimizeAndSave(req.files.profile_photo[0], 'profile') : existing.profile_photo_path;
    const banner = req.files?.hero_banner?.[0] ? await optimizeAndSave(req.files.hero_banner[0], 'profile') : existing.hero_banner_path;
    db.prepare(`UPDATE photographer_profile SET studio_name=?, logo_path=?, profile_photo_path=?, bio=?, whatsapp_number=?, email=?, social_links_json=?, address=?, hero_banner_path=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(
        req.body.studio_name,
        logo,
        profilePhoto,
        req.body.bio,
        req.body.whatsapp_number,
        req.body.email,
        JSON.stringify({ instagram: req.body.instagram, facebook: req.body.facebook, tiktok: req.body.tiktok }),
        req.body.address,
        banner,
        existing.id
      );
    res.redirect('/admin/profile');
  }
};

module.exports = AdminController;
