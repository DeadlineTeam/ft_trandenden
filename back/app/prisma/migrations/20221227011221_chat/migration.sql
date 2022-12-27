-- CreateEnum
CREATE TYPE "VISIBILITY" AS ENUM ('DM', 'PRIVATE', 'PROTECTED', 'PUBLIC');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "FRIENDSHIPSTATUS" AS ENUM ('PENDING', 'FRIEND', 'BLOCKED');

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "sentTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "visibility" "VISIBILITY" NOT NULL,
    "passwd" TEXT,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberShip" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "muted" BOOLEAN NOT NULL,
    "muteTime" TIMESTAMP(3) NOT NULL,
    "role" "ROLE" NOT NULL,

    CONSTRAINT "MemberShip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendShip" (
    "id" SERIAL NOT NULL,
    "InitiatorId" INTEGER NOT NULL,
    "AcceptorId" INTEGER NOT NULL,
    "status" "FRIENDSHIPSTATUS" NOT NULL,

    CONSTRAINT "FriendShip_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberShip" ADD CONSTRAINT "MemberShip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberShip" ADD CONSTRAINT "MemberShip_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_InitiatorId_fkey" FOREIGN KEY ("InitiatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendShip" ADD CONSTRAINT "FriendShip_AcceptorId_fkey" FOREIGN KEY ("AcceptorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
