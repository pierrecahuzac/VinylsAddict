-- DropForeignKey
ALTER TABLE "Album" DROP CONSTRAINT "Album_userId_fkey";
-- DropForeignKey
ALTER TABLE "UserAlbum" DROP CONSTRAINT "UserAlbum_albumId_fkey";
-- DropForeignKey
ALTER TABLE "UserAlbum" DROP CONSTRAINT "UserAlbum_userId_fkey";
-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_albumId_fkey";
-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_userId_fkey";
-- AlterTable
ALTER TABLE "Album" ALTER COLUMN "userId" DROP NOT NULL;
-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "UserAlbum" ADD CONSTRAINT "UserAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;
