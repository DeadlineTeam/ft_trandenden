import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameHistoryDto } from './dto/gameHistoryDto';
import { gameResult } from '@prisma/client';
import { UpdateUserNameDto } from 'src/users/dto/updateUsername.dto';


@Injectable()
export class GameHistoryService {
	constructor (private prisma: PrismaService) {}

	private async playerResult (gameHistory: GameHistoryDto): Promise<any>
	{
		const results = [
			{
				id: gameHistory.player1.id,
				result: gameHistory.player1Score > gameHistory.player2Score ? gameResult.WIN : gameResult.LOSS,
			},
			{
				id: gameHistory.player2.id,
				result: gameHistory.player2Score > gameHistory.player1Score ? gameResult.WIN : gameResult.LOSS,
			}
		]
		return results;
	}

	private playerRank(level: number): number
	{
		if (level < 1)
			return 0;
		if (level < 3)
			return 1;
		if (level < 5)
			return 2;
	}

	rankAvatar(rank: number): string
	{
		if (rank === 0)
			return "/uploads/avatars/rank0";
		if (rank === 1)
			return "/uploads/avatars/rank1";
		if (rank === 2)
			return "/uploads/avatars/rank2";
	}

	private async updatePlayerStats (result: any, playerInfo: any): Promise<any>
	{
		console.log(result, "result");
		var player1 = result.find((player) => player.id === 1);
		var player2 = result.find((player) => player.id === 2);

		console.log(player1, "player1");
		console.log(player2, "player2");
		let db = playerInfo.players.map((info: any) => {
			var match = info.player.id === player1.id ? player1 : player2;
			return {
				id: info.player.id,
				win: match.result === gameResult.WIN ? info.player.win + 1 : info.player.win,
				loss: match.result === gameResult.LOSS ? info.player.loss + 1 : info.player.loss,
				level: match.result === gameResult.WIN ? info.player.level + 0.25 : info.player.level,
				rank: match.result === gameResult.WIN ? this.playerRank(info.player.level + 0.25) : this.playerRank(info.player.level),
				rankavatar: this.rankAvatar(match.result === gameResult.WIN ? this.playerRank(info.player.level + 0.25) : this.playerRank(info.player.level)),
				winrate: match.result === gameResult.WIN ? (info.player.win + 1) / (info.player.win + info.player.loss + 1) : info.player.win / (info.player.win + info.player.loss + 1),
				totalgames: info.player.totalgames + 1,
			}
		});
		console.log(db, "db");
		for (let i = 0; i < db.length; i++)
		{
			await this.prisma.user.update({
				where: {
					id: db[i].id,
				},
				data: db[i],
			});
		}
		return db;
	}

	async addGameHistory(gameHistory: GameHistoryDto): Promise<any>
	{
		const results = await this.playerResult(gameHistory);
		console.log(results);
		const res = await this.prisma.game.create({
			data: {
				players: {
					create: [
						{
							score: gameHistory.player1Score,
							mode : gameHistory.gameMode,
							result: results[0].result,
							player: { connect: { id: gameHistory.player1.id }, },
						},
						{
							score: gameHistory.player2Score,
							result: results[1].result,
							mode : gameHistory.gameMode,
							player: { connect: { id: gameHistory.player2.id },}
						},
					],
				},
			},
			include: {
				players: {
					include: {
						player: true,
					},
				}
			},
		});
		return await this.updatePlayerStats(results, res);
	}


	async usergamerHistory(userName: string) : Promise<any>
	{
		const res = await this.prisma.game.findMany({
			where: {
				players: {
					some: {
						player: {
							username: userName,
						},
					},
				},
			},
			include: {
				players: {
					include: {
						player: true,
					},
					orderBy:
					{
						player: {
							id: 'asc',
						}
					},
				}
			},
		});
		// return res;
		const processedResult = res.map((game) => {
			return {
				player1: {
					id: game.players[0].player.id,
					username: game.players[0].player.username,
					level: game.players[0].player.level,
					rank: game.players[0].player.rank,
					score: game.players[0].score,	
				},
				player2: {
					id: game.players[1].player.id,
					username: game.players[1].player.username,
					level: game.players[1].player.level,
					avatar: game.players[1].player.avatar_url,
					score: game.players[1].score,
				},	
			}
		});
		return processedResult;
	}
}
