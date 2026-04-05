/*
  Warnings:

  - You are about to drop the column `condition` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Album` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "condition",
DROP COLUMN "genre",
ADD COLUMN     "conditionId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Condition" (
    "id" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "nameFR" TEXT,

    CONSTRAINT "Condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VinylVariant" (
    "id" TEXT NOT NULL,
    "nameEN" TEXT NOT NULL,
    "nameFR" TEXT,

    CONSTRAINT "VinylVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlbumStyles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlbumStyles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AlbumVariants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_AlbumVariants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Style_name_key" ON "Style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Condition_nameEN_key" ON "Condition"("nameEN");

-- CreateIndex
CREATE UNIQUE INDEX "VinylVariant_nameEN_key" ON "VinylVariant"("nameEN");

-- CreateIndex
CREATE INDEX "_AlbumStyles_B_index" ON "_AlbumStyles"("B");

-- CreateIndex
CREATE INDEX "_AlbumVariants_B_index" ON "_AlbumVariants"("B");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Style" ADD CONSTRAINT "Style_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumStyles" ADD CONSTRAINT "_AlbumStyles_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumStyles" ADD CONSTRAINT "_AlbumStyles_B_fkey" FOREIGN KEY ("B") REFERENCES "Style"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumVariants" ADD CONSTRAINT "_AlbumVariants_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumVariants" ADD CONSTRAINT "_AlbumVariants_B_fkey" FOREIGN KEY ("B") REFERENCES "VinylVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
