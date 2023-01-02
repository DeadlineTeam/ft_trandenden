import { Injectable } from '@nestjs/common';
import {PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client'
import { UpdateUserNameDto } from './dto/updateUsername.dto';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import {NotFoundException} from '@nestjs/common';

function exclude<User, Key extends keyof User>(
	user: User,
	keys: Key[]
  ): Omit<User, Key> {
	for (let key of keys) {
	  delete user[key]
	}
	return user
}

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
				link: `localhost:3000/profile/${profile.username}`,
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

	async getStats(username: UpdateUserNameDto): Promise<any>
	{
		const res = await this.prisma.user.findUnique({
			where: {
				username: username.username,
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
		if (res === null)
			throw new NotFoundException('User not found');
		return res;
	}

	async getIconInfo(username: UpdateUserNameDto): Promise<any>
	{
		console.log("usernaaaaaame ", username);
		const res = await this.prisma.user.findUnique({
			where: {
				username: username.username,
			},
			select: {
				id : true,
				level: true,
				avatar_url: true,
				username: true,
				twofactor: true,
				link: true,
			},
		})
		if (res === null)
			throw new NotFoundException('User not found');
		console.log("usernaaaaaame ",username);
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
		if (res === null)
			throw new NotFoundException('No matches found');
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
				link: `localhost:3000/profile/${updateUserNameDto.username}`,
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

	async turnOffTwofa(userId: number): Promise<any>
	{
		const res = await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				twofactor: false,
			},
		})
		return res;
	}

	async findByuername(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				username: username,
			},
		})
	}
	
	async getAllUsers(id: number): Promise<User[]> {
		const users = await this.prisma.user.findMany();
		users.map((user) => {
			 exclude(user, ['twofasecret']);
		})
		return users.filter((user) => user.id !== id);
	}

	async getByuername(username: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: {
				username: username,
			},
		})
	}

	async setOnline (id: number, status: boolean) {
		return await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				online: status,
			},
		})
	}

	async setInGame (id: number, status: boolean) {
		return await this.prisma.user.update({
			where: {
				id: id,
			},
			data: {
				inGame: status,
			},
		})
	}

	async getOnlineStatus (id: number) {
		return await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				online: true,
			},
		})
	}

	async getInGameStatus (id: number) {
		return await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				inGame: true,
			},
		})
	}

	async getStatus (id: number) {
		return await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				online: true,
				inGame: true,
			},
		})
	}

}