import { Controller, Get, Post, Body, Param, Delete, UploadedFile, UseGuards } from '@nestjs/common';
import { UsersService} from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/User.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { editFilename, imageFileFilter } from './utils/upload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
@ApiTags('userProfile')
export class UsersController {

	constructor (private readonly userService: UsersService) {}
	@Post('Avatar/:id')
	@UseInterceptors(FileInterceptor('file',{
		storage: diskStorage({
			destination: './uploads',
			filename: editFilename,
		}),
		fileFilter: imageFileFilter,
	}),)
	async updateAvatar(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
		return await this.userService.updateAvatar(+id, file.path);
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

	@Get('/intraId/:id')
	async userIntraId(@Param('id') id: number)
	{
		return this.userService.intraId(+id);
	}
}