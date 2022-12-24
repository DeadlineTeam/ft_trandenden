-- CreateEnum
CREATE TYPE "gameMode" AS ENUM ('CLASSIC', 'ULTIMATE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "level" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "loss" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rankavatar" TEXT,
ADD COLUMN     "win" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "winrate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "mode" "gameMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gameHistory" (
    "playerid" INTEGER NOT NULL,
    "gameid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gameHistory_pkey" PRIMARY KEY ("playerid","gameid")
);

-- AddForeignKey
ALTER TABLE "gameHistory" ADD CONSTRAINT "gameHistory_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gameHistory" ADD CONSTRAINT "gameHistory_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
