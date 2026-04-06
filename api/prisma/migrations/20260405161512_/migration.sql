-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "price" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Format" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "speed" TEXT,
    "description" TEXT,

    CONSTRAINT "Format_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Format_name_key" ON "Format"("name");
