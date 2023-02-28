import {NotFoundException} from '@nestjs/common';
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
		if (level >= 0.5 && level < 2)
			return 1;
		if (level >= 2 && level < 5)
			return 2;
		if (level >= 5)
			return 3;
		return 0;
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
		let db = playerInfo.players.map((info: any) => {
			var match = info.player.id === result[0].id ? result[0] : result[1];
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


	async usergamerHistory(username: UpdateUserNameDto) : Promise<{}>
	{
		const res = await this.prisma.game.findMany({
			where: {
				players: {
					some: {
						player: {
							username: username.username,
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
		if (res.length === 0)
			throw new NotFoundException('No game history found');
		const processedResult = res.map((game) => {
			return {
				player1: {
					id: game.players[0].player.id,
					username: game.players[0].player.username,
					level: game.players[0].player.level,
					avatar: game.players[0].player.avatar_url,
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
