
import { Controller, Post, Get , Body, Request ,Response} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateUserNameDto } from 'src/users/dto/updateUsername.dto';
import { Response as Res} from 'express';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
	constructor(private profile: ProfileService) {
	}

	@Get('iconInfo')
	async getIconInfo(@Body() username: UpdateUserNameDto, @Request() req) {
		if (username.username === "me")
			username.username = req.user.username
			return await this.profile.getIconInfo(username);
		}

	@Get('stats')
	async getStats(@Body() username: UpdateUserNameDto, @Request() req) {
		if (username.username === "me")
			username.username = req.user.username
		return await this.profile.getStats(username);
	}

	// check for null responses
	@Get('gameHistory')
	async getGameHistory(@Body() username: UpdateUserNameDto, @Request() req) {
		if (username.username === "me")
			username.username = req.user.username
		return await this.profile.getGameHistory(username);
	}

	@Post('logout')
	async logout(@Response() res: Res) {
		return await this.profile.logout(res);
	}
}
