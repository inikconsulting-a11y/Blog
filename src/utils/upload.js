const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) return cb(new Error('Fichier invalide'));
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

async function optimizeAndSave(file, subDir = 'general') {
  const dir = path.join(uploadDir, subDir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
  const absolute = path.join(dir, filename);
  await sharp(file.buffer).resize({ width: 2200, withoutEnlargement: true }).webp({ quality: 82 }).toFile(absolute);
  return `/uploads/${subDir}/${filename}`;
}

module.exports = { upload, optimizeAndSave };
