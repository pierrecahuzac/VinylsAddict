import express from "express";
import mainRouter from "./routers/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from 'express-rate-limit';

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(cookieParser());
app.use(express.json()); 
app.disable("x-powered-by");


const isDev = process.env.NODE_ENV === "development";

const corsOptions = {
  origin: isDev 
    ? ["http://localhost:55173", "http://localhost:5173", "http://192.168.1.181:55173"] // Ajout de l'IP locale
    : process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));


app.use(mainRouter);

const port = process.env.PORT || 33000;
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});