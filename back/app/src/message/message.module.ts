import { Module } from "@nestjs/common";
import { FriendModule } from "src/friend/friend.module";
import { MemberModule } from "src/member/member.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";

@Module({
	imports: [
		PrismaModule,
		FriendModule,
		MemberModule
	],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService]
})
export class MessageModule {}
