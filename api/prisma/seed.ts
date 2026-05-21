import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import datas from "./seedData.json" with { type: "json" };
import bcrypt from "bcryptjs";

const seedDB = async () => {
  
  for (const genreData of datas.genres) {
    await prisma.genre.upsert({
      where: { name: genreData.name },
      update: {},
      create: {
        name: genreData.name,
        styles: {
          create: genreData.styles.map((styleName) => ({
            name: styleName,
          })),
        },
      },
    });
  }

 
  for (const condition of datas.conditions) {
    await prisma.condition.upsert({
      where: { nameEN: condition.nameEN },
      update: {},
      create: condition,
    });
  }


  for (const variant of datas.vinylVariants) {
    await prisma.vinylVariant.upsert({
      where: { nameEN: variant.nameEN },
      update: {},
      create: variant,
    });
  }

  for (const format of datas.formats) {
    await prisma.format.upsert({
      where: { name: format.name },
      update: {},
      create: format,
    });
  }

  const saltRounds = 10;
const devPassword = "password123";

const prodPassword = process.env.PROD_SYSTEM_PASSWORD;


const passwordToHash = process.env.NODE_ENV === "production" && prodPassword 
  ? prodPassword 
  : devPassword;


const hashedPassword = await bcrypt.hash(passwordToHash, saltRounds);


const user = await prisma.user.upsert({
  where: { email: "dev@va.eu" },
  update: {}, 
  create: {
    email: "dev@va.eu",
    username: "dev",
    password: hashedPassword, 
    role: "ADMIN",
  },
});

   for (const albumData of datas.albums) {
   
    const format = await prisma.format.findUnique({
      where: { name: albumData.formatName },
    });

  
    const genre = await prisma.genre.findUnique({
      where: { name: albumData.genreName },
    });

    if (!format) {
      console.warn(
        `⚠️ Format "${albumData.formatName}" non trouvé pour l'album ${albumData.title}. Skip.`,
      );
      continue;
    }

    await prisma.album.create({
      data: {
        title: albumData.title,
        artist: albumData.artist,
        releaseDate: albumData.releaseDate,
        trackCount: albumData.trackCount,
        userId: user.id,
        formatId: format.id,
        genres: {
          connect: genre ? [{ id: genre.id }] : [],
        },
      },
    });
  }
};

seedDB()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
