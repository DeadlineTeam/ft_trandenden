import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ROLE } from '@prisma/client';
import { OnlineService } from 'src/online/online.service';

const mappedType = (role: string) => {
	switch (role) {
		case 'owner':
			return ROLE.OWNER;
		case 'admin':
			return ROLE.ADMIN;
		case 'user':
			return ROLE.USER;
		default:
			return undefined
	}
}


@Injectable()
export class MemberService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly online: OnlineService,
	) {}

	
	async addMember(roomId: number, userId: number) {
		let member = await this.getMember(roomId, userId);
		if (!member) {
			member = await this.prisma.memberShip.create({
				data: {
					roomId: roomId,
					userId: userId,
					role: ROLE.USER
				}
			});
			this.online.broadcast ("update", "join", userId, roomId);
		}
		return member;
	}

	async getMember(roomId: number, userId: number) {
		return await this.prisma.memberShip.findFirst ({
			where: {
				roomId: roomId,
				userId: userId
			}
		});
	}

	async deleteMember(roomId: number, userId: number) {
		return await this.prisma.memberShip.deleteMany({
			where: {
				roomId: roomId,
				userId: userId
			}
		});
	}

	async getRole(roomId: number, userId: number) {
		const member = await this.getMember(roomId, userId);
		return member?.role;
	}

	async getAllMembers(roomId: number) {
		return await this.prisma.memberShip.findMany({
			where: {
				roomId: roomId
			},
			include : {
				user: true,
				
			}
		});
	}
	async getOwner(roomId: number) {
		return await this.prisma.memberShip.findMany({
			where: {
				roomId: roomId,
				role: ROLE.OWNER
			}
		});
	}

	async setRole (roomId: number, userId: number, role: string) {
		return await this.prisma.memberShip.updateMany({
			where: {
				roomId: roomId,
				userId: userId
			},
			data: {
				role: mappedType(role)
			}
		});
	}

	async updateRole(roomId: number, userId: number, role: string) {
		const member = await this.getMember(roomId, userId);
		if (member?.role === ROLE.OWNER) {
			throw new HttpException('Cannot change owner', 400);
		}
		if (role === ROLE.USER || role == ROLE.ADMIN) {
			return this.setRole(roomId, userId, role); 
		}
	}

	async muteUser(roomId: number, userId: number) {
		const member = await this.getMember(roomId, userId);
		if (member?.role === ROLE.OWNER || member?.role === ROLE.ADMIN) {
			throw new HttpException('Cannot mute owner or admin', 400);
		}
		if (member?.muted === true) {
			throw new HttpException('User is already muted', 400);
		}
		setTimeout (async () => {
			await this.unmuteUser(roomId, userId);
		}, 20000)
		return await this.prisma.memberShip.updateMany({
			where: {
				roomId: roomId,
				userId: userId
			},
			data: {
				muted: true,
				muteTime: 120 // 2 minutes
			}
		});
	}

	async unmuteUser(roomId: number, userId: number) {
		const member = await this.getMember(roomId, userId);
		if (member && member.muted === true) {
			return await this.prisma.memberShip.updateMany({
				where: {
					roomId: roomId,
					userId: userId
				},
				data: {
					muted: false,
					muteTime: 0
				}
			});
		}
	}

	async getRooms (userId: number) {
		const rooms = await this.prisma.memberShip.findMany({
			where: {
				userId: userId
			},
			select : {
				roomId: true
			}
		});
		return rooms;
	}

	async getMembersIds (roomId: number) {
		const members = await this.prisma.memberShip.findMany({
			where: {
				roomId: roomId
			},
			select: {
				userId: true
			}
		});
		return members.map (member => member.userId);
	}

}
