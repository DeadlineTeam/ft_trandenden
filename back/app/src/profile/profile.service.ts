import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameHistoryService } from 'src/game-history/game-history.service';
import { UsersService } from 'src/users/users.service';
import { UpdateUserNameDto } from 'src/users/dto/updateUsername.dto';
import { Response as Res} from 'express';

@Injectable()
export class ProfileService {
	constructor (
		private gameHistory: GameHistoryService,
		private users: UsersService,
		) {}
	
	async getIconInfo(username: UpdateUserNameDto) {
		return await this.users.getIconInfo(username);
	}
	
	async getStats(username: UpdateUserNameDto) : Promise<any>{
		return await this.users.getStats(username);
	}

	async getGameHistory(username: UpdateUserNameDto) {
		return await this.gameHistory.usergamerHistory(username);
	}

	async logout(res: Res) {
		return this.users.logout(res);
	}
}
