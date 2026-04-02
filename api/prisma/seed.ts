import  pkg  from "@prisma/client";
const {PrismaClient} = pkg;
const prisma = new PrismaClient();
import datas from "./seedData.json" with { type: "json" };

const seedDB = async () => {
  const genres = await prisma.genre.createMany({
    data: datas.genres,
    skipDuplicates: true,
  });
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