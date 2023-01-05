import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GameHistoryService } from 'src/game-history/game-history.service';
import { UsersService } from 'src/users/users.service';
import { UpdateUserNameDto } from 'src/users/dto/updateUsername.dto';
import { Response as Res} from 'express';
import {FriendService} from 'src/friend/friend.service';


@Injectable()
export class ProfileService {
	constructor (
		private gameHistory: GameHistoryService,
		private users: UsersService,
		private friend: FriendService,
		) {}
	
	async getIconInfo(username: UpdateUserNameDto, user: any) {
		var info;
		if (username.username === 'me')
		{
			info = await this.users.getIconInfo({username: user.username,});
			return info;
		}
		info = await this.users.getIconInfo(username);
		if (info != null) {
			const friendId = await this.users.findByuername(username.username);
			const friendship = await this.friend.friendStatus(user.userId, friendId.id);
			info.friendship = friendship;
			return info;
		}
		return info;
	}
	
	async getStats(username: UpdateUserNameDto) : Promise<any>{
		return await this.users.getStats(username);
	}

	async getGameHistory(username: UpdateUserNameDto) {
		return await this.gameHistory.usergamerHistory(username);
	}

	async logout(res: Res, userId: number) {
		return this.users.logout(res);
	}
}
