import { Injectable } from '@nestjs/common';
import {PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'
import { Update2faDto } from './dto/update2fa.dto';
import { UpdateUserNameDto } from './dto/updateUsername.dto';
import { UserDto } from './dto/User.dto';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findbylogin(profile: any): Promise<User | null> {
		console.log(profile.username);
		const res = this.prisma.user.findUnique({
			where: {
				login: profile.username,
			}
		})
		return res;
	}

	async addUserAuth(profile: any): Promise<User> {
		const res = this.prisma.user.create({
			data:{
				login: profile.username,
				fortytwoid: Number(profile.id),
				avatar_url: "",
				username: profile.username,
			}
		})
		return res;
	}

	async updateAvatar(id: number, filePath: string): Promise<any>
	{
		console.log(id);
		console.log(filePath)
		console.log(await this.prisma.user.update({where: {id} , data: {avatar_url: filePath},}));
		return {avatar_url: filePath};
	}

	async userAvatar(): Promise<string>
	{
		return "";
	}

	async updateUserprofile(profile: UserDto): Promise<number>
	{
		this.prisma.user.update({where: {id: profile.id} , data: profile,});
		return profile.id;
	}
}