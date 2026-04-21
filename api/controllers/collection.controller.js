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

      // Vérifier que l'album existe
      // const albumExists = await prisma.userAlbum.findFirst({
      //   where: {
      //     userId,
      //     albumId,
      //   },
      // });
      // console.log(albumExists);

      // if (albumExists) {

      //   return res
      //     .status(400)
      //     .json({ message: "Album déjà dans la collection" });
      // }

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
