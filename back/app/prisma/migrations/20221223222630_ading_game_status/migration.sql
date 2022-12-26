-- CreateEnum
CREATE TYPE "gameStatus" AS ENUM ('STARTED', 'GOING', 'FINISHED');

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "status" "gameStatus" NOT NULL DEFAULT 'STARTED';
