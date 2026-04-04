import prisma from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const Usercontroller = {
  signup: async (req, res) => {
    try {
      const { email, password, passwordConfirmation, username } = req.body;

      const foundUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (foundUser) {
        console.log("user exists");
        return res.status(400).json({ message: "User already exists" });
      }
      if (password !== passwordConfirmation) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      const hashedPassword = await bcryptjs.hash(password, 10);
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          username,
        },
      });

      return res.status(201).json({ message: "User créé !", user: newUser });
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

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const comparePassword = await bcryptjs.compare(password, user.password);
      if (!comparePassword) {
        return res.status(400).json({ message: "Invalid password" });
      }
      delete user.password;
      const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("va_token", jwtToken, {
        httpOnly: true, // INTERDIT l'accès au token via document.cookie en JS
        secure: process.env.NODE_ENV === "prod" ? true : false, // Uniquement via HTTPS (en prod)
        sameSite: process.env.NODE_ENV === "strict", // Empêche les attaques CSRF
        maxAge: 3600000, // 1 heure
      });
      return res
        .status(200)
        .json({ message: "Login successful", user, isLogged: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
  checkToken: async (req, res) => {
    const token = req.headers.cookie.replace("va_token=", "");

    console.log(token);

    const tokenVerified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("tokenVerified", tokenVerified);
    try {
      const userIsdConnected = await prisma.user.findUnique({
        where: {
          id: tokenVerified.userId,
        },
      });
      if (userIsdConnected) {
        delete userIsdConnected.password;
        return res.status(200).json({ user: userIsdConnected, isLogged: true });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default Usercontroller;
