import express from "express";
import mainRouter from "./routers/index.js";
import cors  from 'cors'
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
const CORS = {
  origin: 'http://192.168.1.181:55173', // Remplacez par l'origine de votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Permet d'envoyer des cookies
}; 
 
app.use(cors(CORS));
const port = process.env.PORT || 33000;

app.use(express.json());
app.use("/api", mainRouter);

app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});
