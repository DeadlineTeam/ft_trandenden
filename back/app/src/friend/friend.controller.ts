import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { request } from 'https';

@UseGuards (JwtAuthGuard)
@Controller('friend')
export class FriendController {
	constructor(private readonly friendService: FriendService) {}

	@Post ('/:Id/add')
	async addfriend(@Req() req, @Param('Id', ParseIntPipe) Id: number) {
		return this.friendService.add (req.user.userId, Id)
	}
	// @Post ('/:Id/delete')
	// async removefriend (@Req () req, @Param('Id', ParseIntPipe) Id: number) {
	// 	return this.friendService.delete (req.user.userId, Id)
	// }
	@Post ('/:Id/block')
	async blockfriend (@Req () req, @Param('Id', ParseIntPipe) Id: number) {
		return this.friendService.block (req.user.userId, Id)
	}
	@Post ('/:Id/unblock')
	async unblockfriend (@Req () req, @Param('Id', ParseIntPipe) Id: number) {
		return this.friendService.unblock (req.user.userId, Id);
	}
	@Get ('/all')
	async getallfriends (@Req () req) {
		return this.friendService.getall (req.user.userId);
	}
}

