/*
  Warnings:

  - You are about to drop the column `mode` on the `Game` table. All the data in the column will be lost.
  - Added the required column `mode` to the `gameHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "mode";

-- AlterTable
ALTER TABLE "gameHistory" ADD COLUMN     "mode" "gameMode" NOT NULL;
