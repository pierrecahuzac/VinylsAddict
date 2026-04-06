/*
  Warnings:

  - You are about to drop the column `color` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `conditionId` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Album` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_conditionId_fkey";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "color",
DROP COLUMN "conditionId",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "UserAlbum" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "boughtAt" TIMESTAMP(3),
    "notes" TEXT,
    "color" TEXT,
    "conditionId" TEXT,

    CONSTRAINT "UserAlbum_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserAlbumVariants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserAlbumVariants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAlbum_userId_albumId_key" ON "UserAlbum"("userId", "albumId");

-- CreateIndex
CREATE INDEX "_UserAlbumVariants_B_index" ON "_UserAlbumVariants"("B");

-- AddForeignKey
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Condition"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAlbumVariants" ADD CONSTRAINT "_UserAlbumVariants_A_fkey" FOREIGN KEY ("A") REFERENCES "UserAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAlbumVariants" ADD CONSTRAINT "_UserAlbumVariants_B_fkey" FOREIGN KEY ("B") REFERENCES "VinylVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
