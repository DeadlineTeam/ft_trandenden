import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameHistoryDto } from './dto/gameHistoryDto';
import { GameDto } from './dto/gameDto';


@Injectable()
export class GameHistoryService {
	constructor (private prisma: PrismaService) {}

	
	async addGameHistory(gameHistory: GameHistoryDto): Promise<number>
	{
		const res = await this.prisma.game.create({
			data: {
				mode: gameHistory.gameMode,
				players: {
					create: [
						{
							score: gameHistory.player1Score,
							player: { connect: { id: gameHistory.player1.id }, },
						},
						{
							score: gameHistory.player2Score,
							player: { connect: { id: gameHistory.player2.id }, },
						},
					],
				},
			},
		});
		return res.id;
	}
}
