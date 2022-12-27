import { Injectable } from '@nestjs/common';
import {PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'
import { UpdateUserNameDto } from './dto/updateUsername.dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async findById (id: number): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				id: id
			}
		})
	}
	
	async findbylogin(login: string): Promise<User | null> {
		const res = this.prisma.user.findUnique({
			where: {
				login: login,
			}
		})
		return res;
	}

	async addUserAuth(profile: any): Promise<User> {
		const res = this.prisma.user.create({
			data:{
				login: profile.username,
				fortytwoid: Number(profile.id),
				avatar_url: profile._json.image.link,
				username: profile.username,
				rankavatar: "/uploads/avatar.png",
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

	async getStats(userName: string): Promise<any>
	{
		const res = await this.prisma.user.findUnique({
			where: {
				username: userName,
			},
			select: {
				win : true,
				loss: true,
				rank: true,
				rankavatar: true,
				winrate: true,
				totalgames: true,
			},
		})
		return res;
	}

	async getIconInfo(userName: string): Promise<any>
	{
		console.log(userName);
		const res = await this.prisma.user.findUnique({
			where: {
				username: userName,
			},
			select: {
				level: true,
				avatar_url: true,
				username: true,
			},
		})
		return res;
	}

	async leaderboard(): Promise<any>
	{
		const res = await this.prisma.user.findMany({
			select: {
				avatar_url: true,
				username: true,
				level: true,
				winrate: true,
				games :{
					select: {
						result: true,
					},
					orderBy: {
						createdAt: 'desc',
					},
					take:3
				},
				totalgames: true,
			},
			orderBy: {
				winrate: 'desc',
			},
			take: 15,
		})
		return res;
	}

	async updateUsername(userId: number, updateUserNameDto: UpdateUserNameDto): Promise<any>
	{
		const res = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				username: updateUserNameDto.username,
			},
		})
		return res;
	}

	async logout(res: Response): Promise<any>
	{
	return res.status(HttpStatus.OK)
		.clearCookie('Authorization', {httpOnly: true})
		.send({'message': 'logout'});
	}

	async setTwofaSecret(userId: number, secret: string): Promise<any>
	{
		const res = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				twofasecret: secret,
			},
		})
		return res;
	}

	async turnOnTwofa(userId: number): Promise<any>
	{
		const res = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				twofactor: true,
			},
		})
		return res;
	}
}