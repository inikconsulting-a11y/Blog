const db = require('../config/db');

const PortfolioModel = {
  categories() {
    return db.prepare('SELECT * FROM portfolio_categories ORDER BY display_order, id').all();
  },
  publishedAlbumsByCategory(catId) {
    return db.prepare('SELECT * FROM albums WHERE category_id = ? AND is_published = 1 ORDER BY created_at DESC').all(catId);
  },
  albumBySlug(slug) {
    return db.prepare('SELECT * FROM albums WHERE slug = ? AND is_published = 1').get(slug);
  },
  photos(albumId) {
    return db.prepare('SELECT * FROM album_photos WHERE album_id = ? ORDER BY display_order, id').all(albumId);
  }
};

module.exports = PortfolioModel;
