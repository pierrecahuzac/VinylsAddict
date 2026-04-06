/*
  Warnings:

  - You are about to drop the column `color` on the `UserAlbum` table. All the data in the column will be lost.
  - You are about to drop the `_AlbumVariants` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserAlbumVariants` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AlbumVariants" DROP CONSTRAINT "_AlbumVariants_A_fkey";

-- DropForeignKey
ALTER TABLE "_AlbumVariants" DROP CONSTRAINT "_AlbumVariants_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserAlbumVariants" DROP CONSTRAINT "_UserAlbumVariants_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserAlbumVariants" DROP CONSTRAINT "_UserAlbumVariants_B_fkey";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "color" TEXT,
ADD COLUMN     "diskNumber" INTEGER,
ADD COLUMN     "formatId" TEXT,
ADD COLUMN     "trackCount" INTEGER,
ADD COLUMN     "vinylVariantId" TEXT;

-- AlterTable
ALTER TABLE "UserAlbum" DROP COLUMN "color",
ADD COLUMN     "copyNumber" TEXT;

-- DropTable
DROP TABLE "_AlbumVariants";

-- DropTable
DROP TABLE "_UserAlbumVariants";

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_vinylVariantId_fkey" FOREIGN KEY ("vinylVariantId") REFERENCES "VinylVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_formatId_fkey" FOREIGN KEY ("formatId") REFERENCES "Format"("id") ON DELETE SET NULL ON UPDATE CASCADE;
