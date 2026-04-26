const db = require('../config/db');

const ServiceModel = {
  allPublished() {
    return db.prepare('SELECT * FROM services WHERE is_published = 1 ORDER BY display_order, id DESC').all();
  },
  all() {
    return db.prepare('SELECT * FROM services ORDER BY display_order, id DESC').all();
  },
  sections(serviceId) {
    return db.prepare('SELECT * FROM service_sections WHERE service_id = ? ORDER BY display_order, id').all(serviceId);
  },
  create(payload) {
    return db.prepare(`INSERT INTO services (name, slug, short_description, cover_image_path, display_order, is_published)
      VALUES (@name, @slug, @short_description, @cover_image_path, @display_order, @is_published)`).run(payload);
  }
};

module.exports = ServiceModel;
