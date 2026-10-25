import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from "express";
import mainRouter from "./routers/index.js";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/error.middleware.js";

const app: Application = express();

app.set("trust proxy", 1);

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.disable("x-powered-by");

const isDev: boolean = process.env.NODE_ENV === "development";

const devOrigins: string[] = (process.env.AUTHORIZED_IPS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const prodOrigins: string[] = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins: string[] = isDev ? devOrigins : prodOrigins;

const corsOptions: CorsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : (isDev ? true : false),
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

app.use(mainRouter);

app.use(errorHandler);

const port: number = Number(process.env.PORT) || 33000;
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});
