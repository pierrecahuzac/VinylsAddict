import express from "express";
import mainRouter from "./routers/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { env } from "@prisma/config";
const app = express();
app.use(helmet());
app.use(cookieParser());

const origins = process.env.AUTHORIZED_IPS.split(",").map((ip) => ip.trim());

if (process.env.NODE_ENV === "development") {
  const developmentCORS = {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed = origins.some((authorized) => {
        const withPort = `http://${authorized}:55173`;

        const asDomain = authorized.includes("tail2fc6b2.ts.net")
          ? `http://${authorized}:55173`
          : null;

        return origin === withPort || (asDomain && origin === asDomain);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.error(
          `Tentative de connexion bloquée pour l'origine : ${origin}`,
        );
        callback(new Error("Non autorisé par CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };
  app.use(cors(developmentCORS));
}

const port = process.env.PORT || 33000;

app.use(express.json());
app.use("/api", mainRouter);
app.disable("x-powered-by");
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});
