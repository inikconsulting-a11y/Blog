const express = require('express');
const PublicController = require('../controllers/publicController');

const router = express.Router();
router.get('/', PublicController.home);
router.get('/services', PublicController.services);
router.get('/portfolio', PublicController.portfolio);
router.get('/portfolio/:slug', PublicController.albumDetail);
router.get('/blog', PublicController.blog);
router.get('/blog/:slug', PublicController.blogDetail);
router.get('/contact', PublicController.contact);
router.post('/contact', PublicController.submitContact);

module.exports = router;
