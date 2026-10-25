export const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image trop lourde (max 5MB).' });
  }
  if (err?.message?.includes('Type de fichier non autorisé')) {
    return res.status(400).json({ message: err.message });
  }
  const status = err?.status || err?.statusCode || 500;
  res.status(status).json({ message: err?.message || 'Erreur serveur.' });
};
