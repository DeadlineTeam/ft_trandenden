import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { VISIBILITY } from '@prisma/client';
import { ROLE } from '@prisma/client';
import { MemberService } from 'src/member/member.service';

@Injectable()
export class RoomService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly member: MemberService) {}

	async create(createRoomDto: CreateRoomDto, ownerId: number) {
		console.log (createRoomDto);
		if (createRoomDto.users !== undefined && createRoomDto.users.length > 0) {	
			for (const user of createRoomDto.users) {
				const userExists = await this.prisma.user.findUnique ({where: {id: user}});
				if (!userExists) {
					throw new HttpException (`User with id ${user} does not exist`, 400);
				}
			}
		}

		const room = await this.prisma.room.create({
			data: {
				name: createRoomDto.name,
				visibility: createRoomDto.visibility === 'public' ? VISIBILITY.PUBLIC : createRoomDto.visibility === 'private' ? VISIBILITY.PRIVATE : VISIBILITY.PROTECTED,
				passwd: createRoomDto.password,
			}
		});
		await this.member.addMember(room.id, ownerId);
		await this.member.setRole(room.id, ownerId, ROLE.OWNER);
		if (createRoomDto.users !== undefined && createRoomDto.users.length > 0) {
			for (const user of createRoomDto.users) {
				await this.member.addMember(room.id, user);
			}
		}
		return room;
	}
}