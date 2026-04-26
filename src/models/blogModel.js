const db = require('../config/db');

const BlogModel = {
  categories() {
    return db.prepare('SELECT * FROM blog_categories ORDER BY name').all();
  },
  posts() {
    return db.prepare('SELECT bp.*, bc.name as category_name FROM blog_posts bp LEFT JOIN blog_categories bc ON bp.category_id = bc.id WHERE bp.is_published = 1 ORDER BY bp.created_at DESC').all();
  },
  bySlug(slug) {
    return db.prepare('SELECT bp.*, bc.name as category_name FROM blog_posts bp LEFT JOIN blog_categories bc ON bp.category_id = bc.id WHERE bp.slug = ? AND bp.is_published = 1').get(slug);
  }
};

module.exports = BlogModel;
