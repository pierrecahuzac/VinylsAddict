import 'dotenv/config';
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

const port = process.env.PORT || 33000;
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});