import { Controller, Post } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { gameMode } from '@prisma/client';
import { gameStatus } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('game-history')
@Controller('game-history')
export class GameHistoryController {
	constructor(private gameHistory: GameHistoryService) {

	}
}
