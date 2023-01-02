import { Controller, HttpException, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Post, Param, ParseIntPipe} from "@nestjs/common";
import { GameService } from "./services/game.service";
import { Request } from "@nestjs/common"



@Controller ('game')
export class GameController {
	constructor (
		private readonly gameService: GameService,
	) {}

	@UseGuards (JwtAuthGuard)
	@Post ('/invite/:userId')
	async invite (@Request () req, @Param ('userId', ParseIntPipe) userId: number) {
		return this.gameService.invite (req.user.userId, userId);
	}

	@Post ('/accept/:id')
	async accept (@Param ('id') id: string) {
		if (!this.gameService.matchesWithInvites.has (id))
			throw new HttpException ('Invalid invite', 400);
		return "accepted"
	}

	@Post ('/decline/:id')
	async decline (@Param ('id') id: string) {
		this.gameService.decline (id);
		throw new  HttpException ('declined', 400);
	}
}