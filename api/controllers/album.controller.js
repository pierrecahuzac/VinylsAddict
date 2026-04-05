import { log } from "node:console";
import prisma from "../database/prismaClient.js";
import jwt from "jsonwebtoken";
const AlbumController = {
  getAllAlbums: async (req, res) => {
    try {
      const albums = await prisma.album.findMany();
      console.log(albums);
      return res.status(200).json(albums);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  create: async (req, res) =>{
   
    const token = req.cookies.va_token;
    console.log(token);
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(tokenDecoded);
    const userId = tokenDecoded.userId;
    const { title, artist, year, genre, price,condition } = req.body;

    
    try {
      const newAlbum = await prisma.album.create({
        data: {
          title,
          artist,
          //year,
          genre,
          //price: parseFloat(price),
          condition,
          userId
        },
      });
      return res.status(201).json({ message: "Album créé !", album: newAlbum });
      
    } catch (error) {
      console.log(error);      
    }
  }
};

export default AlbumController;
