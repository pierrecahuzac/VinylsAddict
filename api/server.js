import express from 'express';
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 33000;

app.use(express.json());

// Route de test pour créer un utilisateur et voir si la DB répond
app.post('/setup-test', async (req, res) => {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: 'test@vinyls.com',
        name: 'Thaliios',
      },
    });
    res.json({ message: 'User créé !', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(port, () => {
  console.log(`API lancée sur le port ${port}`);
});