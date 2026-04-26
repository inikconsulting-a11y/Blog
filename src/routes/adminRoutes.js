const express = require('express');
const AdminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/auth');
const { upload } = require('../utils/upload');

const router = express.Router();

router.get('/login', AdminController.loginForm);
router.post('/login', AdminController.login);
router.post('/logout', requireAdmin, AdminController.logout);

router.get('/', requireAdmin, AdminController.dashboard);
router.get('/services', requireAdmin, AdminController.services);
router.post('/services', requireAdmin, upload.single('cover_image'), AdminController.createService);

router.get('/portfolio', requireAdmin, AdminController.portfolio);
router.post('/portfolio/categories', requireAdmin, AdminController.createCategory);
router.post('/portfolio/albums', requireAdmin, upload.array('photos', 30), AdminController.createAlbum);

router.get('/blog', requireAdmin, AdminController.blog);
router.post('/blog/categories', requireAdmin, AdminController.createBlogCategory);
router.post('/blog/posts', requireAdmin, upload.single('featured_image'), AdminController.createPost);

router.get('/messages', requireAdmin, AdminController.messages);
router.post('/messages/:id/toggle', requireAdmin, AdminController.toggleMessage);

router.get('/profile', requireAdmin, AdminController.profile);
router.post('/profile', requireAdmin, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'profile_photo', maxCount: 1 },
  { name: 'hero_banner', maxCount: 1 }
]), AdminController.saveProfile);

module.exports = router;
