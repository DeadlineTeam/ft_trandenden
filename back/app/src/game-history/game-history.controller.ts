import { Controller, Post, Get } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { gameMode } from '@prisma/client';
import { gameStatus } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { gameResult } from '@prisma/client';

// @UseGuards(AuthGuard('jwt'))
@ApiTags('game-history')
@Controller('game-history')
export class GameHistoryController {
	constructor(private gameHistory: GameHistoryService) {
	}

	@Post('addGameHistory')
	async addGameHistory() {
		const his = {
			player1: {id: 2},
			player2: {id: 1},
			player1Score: 0,
			player2Score: 55,
			gameMode: gameMode.CLASSIC,
			gameResult: gameResult.LOSS,
		}
		return await this.gameHistory.addGameHistory(his);
	}
	@Get('usergamerHistory')
	async usergamerHistory() {
		return await this.gameHistory.usergamerHistory(2);
	}
}
