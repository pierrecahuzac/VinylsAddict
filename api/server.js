import 'dotenv/config';
import express from "express";
import mainRouter from "./routers/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';

const app = express();

app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.disable("x-powered-by");


const isDev = process.env.NODE_ENV === "development";

const devOrigins = [
  ...(process.env.AUTHORIZED_IPS ? process.env.AUTHORIZED_IPS.split(',') : [])
];

const corsOptions = {
  origin: isDev
    ? devOrigins
    : process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));


app.use(mainRouter);

// Gestion d'erreurs multer / sharp (fileSize, mimetype)
app.use((err, req, res, next) => {
  if (err) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Image trop lourde (max 5MB).' });
    }
    if (err.message?.includes('Type de fichier non autorisé')) {
      return res.status(400).json({ message: err.message });
    }
    // Multer / sharp generic
    return res.status(400).json({ message: err.message || 'Erreur lors de l\'upload.' });
  }
  next();
});

const port = process.env.PORT || 33000;
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});