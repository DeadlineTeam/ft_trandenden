import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UsersService} from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Update2faDto } from './dto/update2fa.dto';
import { UpdateUserNameDto } from './dto/updateUsername.dto';


@Controller('users')
@ApiTags('userProfile')
export class UsersController {

	constructor (private readonly userService: UsersService) {}
	@Post('updateAvatar/:id')
	async updateAvatar(@Param('id') id: string) {
		return await this.userService.updateAvatar();
	}

	@Get('userAvatar/:id')
	async getUserAvatar(@Param('id') id: string)
	{
		return await this.userService.userAvatar();
	}

	@Post('Update2fa/:id')
	async Update2fa(@Param('id') id: string, @Body() Update2fa: Update2faDto)
	{
		console.log("hello");
		console.log(Update2fa);
		return await this.userService.update2fa(+id, Update2fa);
	}

	@Get('get2fa/:id')
	async gete2fa(@Param('id') id: string)
	{
		return await this.userService.get2fa();
	}

	@Post('updateUsername/:id')
	async updateUserName(@Param('id') id: string, @Body() updateUserName:UpdateUserNameDto)
	{
		return await this.userService.updateUsername(+id, updateUserName);
	}

	@Get('username/:id')
	async getUserName(@Param('id') id: string)
	{
		return await this.userService.getUsername();
	}
}