import express from "express";
import pkg from "@prisma/client";
import GenreController from "./controllers/genre.controller.js";
const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 33000;

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de Vinyls Addict !");
});
// Route de test pour créer un utilisateur et voir si la DB répond
app.post("/setup-test", async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: "test@vinyls.com",
        name: "Thaliios",
      },
    });
    res.json({ message: "User créé !", user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/genres", async (req, res) => {
  console.log(req, res);  
  const result = await GenreController.getAllGenres(req, res);
  console.log(result);
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});
