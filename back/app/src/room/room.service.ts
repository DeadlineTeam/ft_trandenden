import { HttpException, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

import { VISIBILITY } from '@prisma/client';
import { ROLE } from '@prisma/client';
import { MemberService } from 'src/member/member.service';
import { UsersService } from 'src/users/users.service';
import { Room } from '@prisma/client';

const visibitymap = (visibility: string) => {
	if (visibility === 'Public') {
		return VISIBILITY.PUBLIC;
	} else if (visibility === 'Private') {
		return VISIBILITY.PRIVATE;
	} else if (visibility === 'Protected'){
		return VISIBILITY.PROTECTED;
	} 
	return undefined;
}


@Injectable()
export class RoomService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly member: MemberService,
		private readonly user: UsersService) {}

	async create(createRoomDto: CreateRoomDto, ownerId: number) {
		console.log (createRoomDto);
		if (createRoomDto.name === undefined || createRoomDto.name === '') {
			throw new HttpException (`Room name is required`, 400);
		}
		if (visibitymap(createRoomDto.visibility) === undefined) {
			throw new HttpException (`Visibility ${createRoomDto.visibility} is not valid`, 400);
		}
		if (createRoomDto.users !== undefined && (createRoomDto.users.length > 0)) {
			for (const u of createRoomDto.users) {
				const user = await this.user.findById(u);
				if (!user) {
					throw new HttpException (`User with id ${u} does not exist`, 400);
				}
			}
		}

		let pass = undefined;
		if (createRoomDto.visibility === 'Protected') {
			if (createRoomDto.password !== undefined && createRoomDto.password !== '') {
				const passwd = await bcrypt.hash (createRoomDto.password, 10);
				pass = passwd;
			}
			else {
				throw new HttpException (`Password is required for protected rooms`, 400);
			}
		}

		const room = await this.prisma.room.create({
			data: {
				name: createRoomDto.name,
				visibility: visibitymap(createRoomDto.visibility),
				passwd: pass,
			}
		});
		await this.member.addMember(room.id, ownerId);
		await this.member.setRole(room.id, ownerId, "owner");
		for (const user of createRoomDto.users) {
			if (user !== ownerId)
				await this.member.addMember(room.id, user);
		}
		return {id: room.id, name: room.name, visibility: room.visibility};
	}

	async findAll(userId: number) {
		// find all rooms 
		const rooms = await this.prisma.room.findMany({});
		const userRooms = [];
		for (const room of rooms) {
			// check if room is private
			if (room.visibility === VISIBILITY.PRIVATE) {
				// check if user is member of room
				const member = await this.member.getMember (room.id, userId);
				if (member !== null) {
					//check if user is not banned
					if (member.banned === false) {
						userRooms.push(room);
					}
				}
			}
			else {
				userRooms.push(room);
			}
		}
		return userRooms;
	}

	async createDM (senderId: number, receiverId: number) {
		if (senderId === receiverId) {
			throw new HttpException (`Cannot create DM with yourself`, 400);
		}
		const receiverIdExists = await this.user.findById(receiverId);
		if (!receiverIdExists) {
			throw new HttpException (`User with id ${receiverId} does not exist`, 400);
		}
		try {
			let DMroom = await this.findByname (`DM-${senderId}-${receiverId}`);
			DMroom = DMroom || await this.findByname (`DM-${receiverId}-${senderId}`);
			if (DMroom) {
				return DMroom;
			}
			DMroom = await this.prisma.room.create({
				data: {
					name: `DM-${senderId}-${receiverId}`,
					visibility: VISIBILITY.DM,
				}
			});
			await this.member.addMember(DMroom.id, senderId);
			await this.member.addMember(DMroom.id, receiverId);
		}
		catch (e) {
			throw new HttpException (`Cannot create DM`, 400);
		}
	}

	async findByname(name: string) {
		const room = await this.prisma.room.findFirst({
			where: {
				name: name,
			}
		});
		return room;
	}
	async findById(id: number) {
		const room = await this.prisma.room.findUnique({
			where: {
				id: id,
			}
		});
		return room;
	}



	async joinRoom (userId: number, roomId: number, password: string) {
		const room = await this.findById (roomId);
		if (!room) {
			throw new HttpException (`Room with id ${roomId} does not exist`, 400);
		}
		if (room.visibility === VISIBILITY.PRIVATE) {
			throw new HttpException (`Room with id ${roomId} is private`, 400);
		}
		if (room.visibility === VISIBILITY.PROTECTED) {
			if (password === undefined || password === '') {
				throw new HttpException (`${room.name} require a password`, 400);
			}
			const pass = await bcrypt.compare (password, room.passwd);
			if (!pass) {
				throw new HttpException (`Password is incorrect`, 400);
			}
		}
		const member = await this.member.getMember (roomId, userId);
		if (member) {
			throw new HttpException (`User with id ${userId} is already a member of room with id ${roomId}`, 400);
		}
		return await this.member.addMember(roomId, userId);
	}

	async leaveRoom (userId: number, roomId: number) {
		const room = await this.findById (roomId);
		if (!room) {
			throw new HttpException (`Room with id ${roomId} does not exist`, 400);
		}
		const member = await this.member.getMember (roomId, userId);
		if (!member) {
			throw new HttpException (`User with id ${userId} is not a member of room with id ${roomId}`, 400);
		}
		return this.member.deleteMember (roomId, userId);
	}

	async  findMyRooms (userId: number) {
		const rooms = await this.prisma.memberShip.findMany({
			where: {
				userId: userId,
				banned: false,
			},
			select: {
				role: true,
				room: {
					select: {
						id: true,
						name: true,
						visibility: true,
					}
				},
			},
		});
		let roomsDto = []
		for (const room of rooms) {
			roomsDto.push (
				{
					role: room.role,
					...room.room
				}
			)
		}
		return roomsDto;
	}



	async searchByName (userId: number, name: string) {
		// when the name starts with name
		// and check if the user is a member of the room
		// and include the membership of the user in the room
		const rooms = await this.prisma.room.findMany({
			where: {
				name: {
					startsWith: name,
					mode: 'insensitive',
				},
				visibility: {
					not: {
						in: [VISIBILITY.DM, VISIBILITY.PRIVATE],
					}
				},
				users: {
					none: {
						userId: userId,
					}
				}
			},
			select: {
				id: true,
				name: true,
				visibility: true,
				createdAt: true,
			}
		});
		return rooms;
	}

	async acessUserCanAcess (userId: number) : Promise<any[]>
	{
		const myrooms = await this.prisma.room.findMany({
			where: {
				visibility: {
					not: {
						in: [VISIBILITY.DM, VISIBILITY.PRIVATE],
					}
				},
				users: {
					none: {
						userId: userId,
						banned: true,
					}
				},
			},
			select : {
				id: true,
				name: true,
				visibility: true,
				users: true,
			}
		});
		const res = myrooms.map((room) => {
			return {
				...room,
				users: room.users.filter((user) => user.userId !== userId),
			}
		})
		console.log(res);
		const result = res.map((room) => {
			if (room.users.length === 0) {
				return {
					roomid: room.id,
					roomname: room.name,
					roomvisibility: room.visibility,
					notMembers: true,
				}
			}
			return {
				roomid: room.id,
				roomname: room.name,
				roomvisibility: room.visibility,
				notMembers: false,
			}
		})
		return result;
	}
}
