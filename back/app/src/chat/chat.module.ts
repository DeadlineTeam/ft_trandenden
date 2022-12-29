import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
	imports: [
		PrismaModule,
		UsersModule,
		AuthModule
	],
	controllers: [ChatController],
	providers: [ChatService, ChatGateway]
})
export class ChatModule {}
