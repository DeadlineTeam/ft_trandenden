/*
  Warnings:

  - Added the required column `updatedAt` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MemberShip" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
