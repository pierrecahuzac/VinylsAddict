-- CreateTable
CREATE TABLE "CollectionImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "userCollectionId" TEXT NOT NULL,

    CONSTRAINT "CollectionImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CollectionImage" ADD CONSTRAINT "CollectionImage_userCollectionId_fkey" FOREIGN KEY ("userCollectionId") REFERENCES "UserAlbum"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
