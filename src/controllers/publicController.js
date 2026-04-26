const db = require('../config/db');
const ServiceModel = require('../models/serviceModel');
const PortfolioModel = require('../models/portfolioModel');
const BlogModel = require('../models/blogModel');

function withProfile() {
  return db.prepare('SELECT * FROM photographer_profile LIMIT 1').get() || {};
}

const PublicController = {
  home(req, res) {
    const profile = withProfile();
    const services = ServiceModel.allPublished();
    const latestPosts = BlogModel.posts().slice(0, 3);
    res.render('public/home', { profile, services, latestPosts });
  },
  services(req, res) {
    const profile = withProfile();
    const services = ServiceModel.allPublished().map((s) => ({ ...s, sections: ServiceModel.sections(s.id) }));
    res.render('public/services', { profile, services });
  },
  portfolio(req, res) {
    const profile = withProfile();
    const categories = PortfolioModel.categories().map((c) => ({ ...c, albums: PortfolioModel.publishedAlbumsByCategory(c.id) }));
    res.render('public/portfolio', { profile, categories });
  },
  albumDetail(req, res) {
    const profile = withProfile();
    const album = PortfolioModel.albumBySlug(req.params.slug);
    if (!album) return res.status(404).send('Album introuvable');
    const photos = PortfolioModel.photos(album.id);
    res.render('public/album-detail', { profile, album, photos });
  },
  blog(req, res) {
    const profile = withProfile();
    const posts = BlogModel.posts();
    const categories = BlogModel.categories();
    res.render('public/blog', { profile, posts, categories });
  },
  blogDetail(req, res) {
    const profile = withProfile();
    const post = BlogModel.bySlug(req.params.slug);
    if (!post) return res.status(404).send('Article introuvable');
    res.render('public/blog-detail', { profile, post });
  },
  contact(req, res) {
    const profile = withProfile();
    res.render('public/contact', { profile, success: req.query.sent === '1' });
  },
  submitContact(req, res) {
    const { name, email, phone, message } = req.body;
    db.prepare('INSERT INTO contact_messages (name, email, phone, message) VALUES (?, ?, ?, ?)').run(name, email, phone, message);
    res.redirect('/contact?sent=1');
  }
};

module.exports = PublicController;
