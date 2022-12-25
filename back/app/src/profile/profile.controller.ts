
import { Controller, Post, Get , Param, Response} from '@nestjs/common';
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

	@Get('iconInfo/:username')
	async getIconInfo(@Param('username') username: string) {
		console.log(username);
		return await this.profile.getIconInfo(username);
	}

	@Get('stats/:username')
	async getStats(@Param('username') username: string) {
		return await this.profile.getStats(username);
	}

	// check for null responses
	@Get('gameHistory/:username')
	async getGameHistory(@Param('username') username: string) {
		return await this.profile.getGameHistory(username);
	}

	@Post('logout')
	async logout(@Response() res: Res) {
		return await this.profile.logout(res);
	}
}
