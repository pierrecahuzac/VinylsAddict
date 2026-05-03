import { log } from "node:console";
import prisma from "../database/prismaClient.js";
import jwt from "jsonwebtoken";

const CollectionController = {
  addAlbumToCollection: async (req, res) => {
    const userId = req.userId;
    
    
    console.log(userId, "userid");

    try {
      const { albumId } = req.params;
      const { price, conditionId } = req.body;

      const userAlbum = await prisma.userAlbum.create({
        data: {
          user: { connect: { id: userId } },
          album: { connect: { id: albumId } },
          price: price ? parseFloat(price) : null,
          condition: { connect: { id: conditionId } },
        },
      });
      console.log("userAlbum", userAlbum);

      return res
        .status(201)
        .json({ message: "Album ajouté à la collection !", userAlbum });
    } catch (error) {
      console.log(error);
    }
  },
};

export default CollectionController;
