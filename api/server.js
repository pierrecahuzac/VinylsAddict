import express from "express";
import mainRouter from "./routers/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "@prisma/config";
const app = express();
app.use(helmet());
app.use(cookieParser());

const origins = process.env.AUTHORIZED_IPS ? process.env.AUTHORIZED_IPS.split(",").map((ip) => ip.trim()) : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin && process.env.NODE_ENV === "development") {
      return callback(null, true);
    }

    if (process.env.NODE_ENV === "development") {
      const isAllowed = origins.some((authorized) => {
        const withPort = `http://${authorized}:55173`;
        const asDomain = authorized.includes("tail2fc6b2.ts.net")
          ? `http://${authorized}:55173`
          : null;
        return origin === withPort || (asDomain && origin === asDomain);
      });

      if (isAllowed) return callback(null, true);
    } else {
      const normalize = (url) => url?.replace(/\/+$/, "").toLowerCase();
      if (normalize(origin) === normalize(process.env.FRONTEND_URL)) {
        return callback(null, true);
      }
    }

    callback(new Error("Non autorisé par CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT || 33000;

app.use(express.json());
app.use("/api", mainRouter);
app.disable("x-powered-by");
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});
