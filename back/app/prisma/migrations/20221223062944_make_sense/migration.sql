/*
  Warnings:

  - You are about to drop the column `mode` on the `gameHistory` table. All the data in the column will be lost.
  - Added the required column `mode` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "mode" "gameMode" NOT NULL;

-- AlterTable
ALTER TABLE "gameHistory" DROP COLUMN "mode";
