import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
import datas from "./seedData.json" with { type: "json" };

const seedDB = async () => {
  console.log("Début du seeding...");

  // 1. Seed des Genres et de leurs Styles (imbriqués)
  for (const genreData of datas.genres) {
    await prisma.genre.upsert({
      where: { name: genreData.name },
      update: {}, // Ne fait rien si le genre existe déjà
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

  // 2. Seed des Conditions
  for (const condition of datas.conditions) {
    await prisma.condition.upsert({
      where: { nameEN: condition.nameEN },
      update: {},
      create: condition,
    });
  }

  // 3. Seed des Variantes (Vinyl Variants)
  for (const variant of datas.vinylVariants) {
    await prisma.vinylVariant.upsert({
      where: { nameEN: variant.nameEN },
      update: {},
      create: variant,
    });
  }
  // 4. Seed des Formats
  for (const format of datas.formats) {
    await prisma.format.upsert({
      where: { name: format.name },
      update: {},
      create: format,
    });
  }
  console.log("Seeding terminé !");
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