/*
  Warnings:

  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AlbumTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlbumTags" DROP CONSTRAINT "_AlbumTags_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumTags" DROP CONSTRAINT "_AlbumTags_B_fkey";

-- DropTable
DROP TABLE "Tag";

-- DropTable
DROP TABLE "_AlbumTags";

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AlbumGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AlbumGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE INDEX "_AlbumGenres_B_index" ON "_AlbumGenres"("B");

-- AddForeignKey
ALTER TABLE "_AlbumGenres" ADD CONSTRAINT "_AlbumGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumGenres" ADD CONSTRAINT "_AlbumGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
