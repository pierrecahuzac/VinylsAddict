import prisma from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const Usercontroller = {
  signup: async (req, res) => {
    try {
      const { email, password, passwordConfirmation, username } = req.body;
      console.log(email, password, passwordConfirmation, username);

      const foundUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (foundUser) {
        console.log("user exists");
        return res.status(400).json({ message:`Une erreur est survenue lors de l'inscription. Veuillez vérifier vos informations ou essayer de vous connecter.` });
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
        return res
          .status(404)
          .json({ message: "Combinaison email / password not work" });
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
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
        sameSite: "lax",
        maxAge: 3600000,
      });
      return res
        .status(200)
        .json({ message: "Login successful", user, isLogged: true });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  },
  logout: (req, res) => {
    res.clearCookie("va_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "prod",
      sameSite: "lax",
    });
    return res
      .status(200)
      .json({ message: "Logout successful", isLogged: false });
  },
  checkToken: async (req, res) => {
    const token = req.cookies.va_token;
    if (!token) return res.status(401).json({ isLogged: false });

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.userId,
        },
      });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found", isLogged: false });
      }
      if (user) {
        delete user.password;
        return res.status(200).json({ user: user, isLogged: true });
      } else {
        return res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error("Erreur technique :", error);
      } else {
        console.log("Visiteur anonyme (OK)");
      }
    }
  },
};

export default Usercontroller;
