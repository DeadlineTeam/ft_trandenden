-- CreateEnum
CREATE TYPE "gameResult" AS ENUM ('WIN', 'LOSS');

-- AlterTable
ALTER TABLE "gameHistory" ADD COLUMN     "result" "gameResult" NOT NULL DEFAULT 'LOSS';
