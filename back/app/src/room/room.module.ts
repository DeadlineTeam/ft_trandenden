import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MemberModule } from 'src/member/member.module';

@Module({
	imports: [
		UsersModule,
		PrismaModule,
		MemberModule
	],
	controllers: [RoomController],
	providers: [RoomService],
	exports: [RoomService]
})
export class RoomModule {}
