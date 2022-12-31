import { Controller, Get, Post, Body, Param, Delete, UploadedFile, UseGuards, Request} from '@nestjs/common';
import { UsersService} from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/User.dto';
import { UpdateUserNameDto } from './dto/updateUsername.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { editFilename, imageFileFilter } from './utils/upload';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {ForbiddenException} from '@nestjs/common';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {

	constructor (private readonly userService: UsersService) {}
	@Post('Avatar')
	@UseInterceptors(FileInterceptor('file',{
		storage: diskStorage({
			destination: './uploads',
			filename: editFilename,
		}),
		fileFilter: imageFileFilter,
	}),)
	async updateAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
		console.log(req.user.userId);
		return await this.userService.updateAvatar(req.user.userId, file.path);
	}

	@Get("leaderboard/")
	async getLaderboard() {
		return await this.userService.leaderboard();
	}

	@Post("username")
	async updateUsername(@Request() req,@Body() updateUsernameDto: UpdateUserNameDto) {
		if (updateUsernameDto.username === "me")
			throw new ForbiddenException("You can't change your username to 'me'");
		return await this.userService.updateUsername(req.user.userId ,updateUsernameDto);
	}
	@Get("username")
	async getUsername(@Request() req) {
		return req.user.username;
	}

	@Get('all')
	async getAllUsers() {
		return await this.userService.getAllUsers();
	}
}