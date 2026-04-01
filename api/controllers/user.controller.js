const Usercontroller = {
  createUser: async (req, res) => {
    try {
      const { email, name } = req.body;
      const newUser = await prisma.user.create({
        data: {
          email,
          name,
        },
      });
      res.json({ message: "User créé !", user: newUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
