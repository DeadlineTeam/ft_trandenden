import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService} from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/User.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';

@Controller('users')
@ApiTags('userProfile')
export class UsersController {

	constructor (private readonly userService: UsersService) {}
	@Post('Avatar/:id')
	async updateAvatar(@Param('id') id: string) {
		return await this.userService.updateAvatar();
	}

	@Get('Avatar/:id')
	async getUserAvatar(@Param('id') id: string)
	{
		return await this.userService.userAvatar();
	}

	@Post('userProfile/:id')
	async userProfile(@Param('id') id: string, @Body() userProfile: UserDto)
	{
		return this.userService.updateUserprofile(userProfile);
	}
}