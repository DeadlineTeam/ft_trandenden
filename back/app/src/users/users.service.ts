import { Injectable } from '@nestjs/common';
import {PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'
import { Update2faDto } from './dto/update2fa.dto';
import { UpdateUserNameDto } from './dto/updateUsername.dto';

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

	async updateAvatar(): Promise<any>
	{
		return "";
	}

	async userAvatar(): Promise<any>
	{
		return "";
	}

	async update2fa(id: number, update2faDto: Update2faDto): Promise<any>
	{
		console.log(update2faDto);
		console.log(update2faDto.twofactor === true);
		return (this.prisma.user.update({where: {id} , data: update2faDto,}));
	}

	async get2fa(): Promise<any>
	{
		return "";
	}

	async updateUsername(id: number, updateUserName: UpdateUserNameDto): Promise<any>
	{
		return (this.prisma.user.update({where: {id} , data: updateUserName,}));
	}

	async getUsername(): Promise<any>
	{
		return ""
	}
}