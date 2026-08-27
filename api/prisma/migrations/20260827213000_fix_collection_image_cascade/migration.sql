-- AlterForeignKey: Change ON DELETE from RESTRICT to CASCADE for CollectionImage
ALTER TABLE "CollectionImage" DROP CONSTRAINT "CollectionImage_userCollectionId_fkey";
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_userCollectionId_fkey" FOREIGN KEY ("userCollectionId") REFERENCES "UserAlbum"("id") ON DELETE CASCADE ON UPDATE CASCADE;
