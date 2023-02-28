import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RoomModule } from 'src/room/room.module';
import { OnlineModule } from 'src/online/online.module';

@Module({
	imports: [
		OnlineModule,
		UsersModule,
		PrismaModule,
		RoomModule
	],
  	controllers: [FriendController],
  	providers: [FriendService],
	exports: [FriendService]
})
export class FriendModule {}
