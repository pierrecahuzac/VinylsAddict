import express from "express";
import mainRouter from "./routers/index.js";
import cors  from 'cors'
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
const app = express();
app.use(helmet());
app.use(cookieParser());

const origins = [
  'http://192.168.1.181:55173',
  'http://100.100.229.28:55173',
  'http://localhost:55173' 
];

const CORS = {
  origin: (origin, callback) => {
   
    if (!origin || origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}; 
 
app.use(cors(CORS));
const port = process.env.PORT || 33000;

app.use(express.json());
app.use("/api", mainRouter);
app.disable('x-powered-by');
app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});
