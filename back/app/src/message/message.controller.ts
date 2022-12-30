import { Controller, Get, Param} from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { MessageService } from "./message.service";
import { Req } from "@nestjs/common";
import { ParseIntPipe } from "@nestjs/common";

@Controller('message')
export class MessageController {
	constructor(private readonly messageService: MessageService) {}
	

	@UseGuards(JwtAuthGuard)
	@Get ('/:roomId')
	async getRoomMessages (@Req () req, @Param('roomId', ParseIntPipe) roomId: number) {
		return this.messageService.getRoomMessages(req.user.userId , roomId);
	}
}