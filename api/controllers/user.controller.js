import prisma from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
const Usercontroller = {
  signup: async (req, res) => {
    try {
      const { email, password, passwordConfirmation } = req.body;
     
      
      const foundUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (foundUser) {
        console.log('user exists');
        return res.status(400).json({ message: "User already exists" });
      }
      if (password !== passwordConfirmation) {
        
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (!foundUser) {
        const hashedPassword = await bcryptjs.hash(password, 10);
        const newUser = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
          },
        });
        return res.status(201).json({ message: "User créé !", user: newUser });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (user.password !== password) {
        return res.status(400).json({ message: "Invalid password" });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      delete user.password;
      return res
        .status(200)
        .json({ message: "Login successful", user, isLogged: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default Usercontroller;
