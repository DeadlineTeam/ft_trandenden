import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [
		UsersModule, PrismaModule
	],
  	controllers: [FriendController],
  	providers: [FriendService],
	exports: [FriendService]
})
export class FriendModule {}
