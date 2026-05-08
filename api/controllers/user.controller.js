import prisma from "../database/prismaClient.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { log } from "node:console";
import { format } from "node:path";
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
        return res.status(409).json({
          message: `Une erreur est survenue lors de l'inscription. Veuillez vérifier vos informations ou essayer de vous connecter.`,
        });
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
          canConnect: true,
        },
      });

      const { password: _, ...userWithoutPassword } = newUser;

      return res
        .status(201)
        .json({ message: "User créé !", user: userWithoutPassword });
    } catch (error) {
      console.error("Signup error:", error);
      return res
        .status(500)
        .json({ error: "Une erreur est survenue lors de l'inscription." });
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
          .status(401)
          .json({ message: "Combinaison email / password incorrecte" });
      }
      if (!user.canConnect) {
        return res.status(401).json({
          message: `Impossible de se connecter avec cet utilisateur.`,
        });
      }
      const comparePassword = await bcryptjs.compare(password, user.password);
      if (!comparePassword) {
        return res
          .status(401)
          .json({ message: "Combinaison email / password incorrecte" });
      }
      delete user.password;
      const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("va_token", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: 3600000,
      });
      return res
        .status(200)
        .json({ message: "Login successful", user, isLogged: true });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Erreur lors de la connexion." });
    }
  },
  logout: (req, res) => {
    res.clearCookie("va_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "lax",
    });
    return res
      .status(200)
      .json({ message: "Logout successful", isLogged: false });
  },
  checkToken: async (req, res) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
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
      console.error("CheckToken error:", error);
      return res.status(500).json({ error: "Erreur de vérification." });
    }
  },
  getOneUserAlbum: async (req, res) => {
    const id = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      // FIX IDOR: On vérifie que l'album appartient bien au userId
      const userAlbum = await prisma.userAlbum.findFirst({
        where: {
          id: id,
          userId: userId,
        },
        include: {
          album: {
            include: {
              vinylVariant: true,
              format: true,
              styles: true,
              genres: true,
            },
          },
          condition: true,
        },
      });

      if (!userAlbum) {
        return res
          .status(404)
          .json({ message: `Détails de l'album introuvables` });
      }
      return res
        .status(200)
        .json({ userAlbum, message: `Détails de l'album trouvés` });
    } catch (error) {
      console.error("getOneUserAlbum error:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération de l'album." });
    }
  },

  checkAlbumInCollection: async (req, res) => {
    const albumId = req.params.id;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      const userAlbum = await prisma.userAlbum.findFirst({
        where: {
          albumId: albumId,
          userId: userId,
        },
      });

      if (!userAlbum) {
        return res
          .status(404)
          .json({ message: `Album non présent dans la collection` });
      }
      return res
        .status(200)
        .json({ userAlbum, message: `Album présent dans la collection` });
    } catch (error) {
      console.error("checkAlbumInCollection error:", error);
      return res.status(500).json({ error: "Erreur de vérification." });
    }
  },
  getAllUserAlbums: async (req, res) => {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      const allUserAlbums = await prisma.userAlbum.findMany({
        where: {
          userId,
        },
        include: {
          album: {
            include: {
              vinylVariant: true,
              format: true,
              styles: true,
              genres: true,
            },
          },
          images: true,
          condition: true,
        },
      });

      if (allUserAlbums.length < 1) {
        return res
          .status(200)
          .json({ message: `Collection vide`, allUserAlbums });
      }
      return res.status(200).json({
        allUserAlbums,
        message: `Liste des albums dans la collection`,
      });
    } catch (error) {
      console.error("getAllUserAlbums error:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération de la collection." });
    }
  },
  changePassword: async (req, res) => {
    const userId = req.userId;
    const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isCurrentPasswordValid = await bcryptjs.compare(
        currentPassword,
        user.password,
      );

      if (!isCurrentPasswordValid) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }

      if (newPassword !== newPasswordConfirmation) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const hashedNewPassword = await bcryptjs.hash(newPassword, 10);

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedNewPassword,
        },
      });

      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("changePassword error:", error);
      return res
        .status(500)
        .json({ error: "Erreur lors du changement de mot de passe." });
    }
  },
  getUserRole: async (req, res) => {
    const userId = req.userId;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      console.log(user);

      if (user) {
        return res.status(200).json({
          role: user.role,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await prisma.user.findMany();

      const usersWithoutPassword = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return res.status(200).json({ users: usersWithoutPassword });
    } catch (error) {
      console.log(error);
    }
  },
  getById: async (req, res) => {
    const id = req.userId;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (user) {
        delete user.password;
        return res.status(200).json({...user });
      }
    } catch (error) {
      console.log(error);
    }
  },
};

export default Usercontroller;
