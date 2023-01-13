import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { MemberModule } from 'src/member/member.module';
import { MessageModule } from 'src/message/message.module';
import { FriendModule } from 'src/friend/friend.module';
import { OnlineModule } from 'src/online/online.module';

@Module({
	imports: [
		OnlineModule,
		FriendModule,
		PrismaModule,
		UsersModule,
		MemberModule,
		MessageModule,
		AuthModule
	],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway]
})
export class ChatModule {}
