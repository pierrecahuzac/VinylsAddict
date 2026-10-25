import multer from 'multer';

const ALLOWED_MIMES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

// memoryStorage -> on nettoie les EXIF avec sharp avant d'écrire sur disque
// (sharp supprime GPS/EXIF/XMP par défaut si on n'appelle pas withMetadata())
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Seuls JPEG/PNG/WebP sont acceptés.'));
    }
  },
});
