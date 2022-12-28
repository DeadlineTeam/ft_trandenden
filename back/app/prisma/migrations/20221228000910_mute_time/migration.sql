/*
  Warnings:

  - The `muteTime` column on the `MemberShip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MemberShip" DROP COLUMN "muteTime",
ADD COLUMN     "muteTime" INTEGER NOT NULL DEFAULT 0;
