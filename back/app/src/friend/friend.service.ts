import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { FRIENDSHIPSTATUS } from '@prisma/client'

@Injectable()
export class FriendService {
	constructor (
		private readonly prisma: PrismaService,
		private readonly user: UsersService,
	) {}

	// add a friend to the user
	async add (userId: number, friendId: number) {
		const friend = await this.prisma.user.findUnique ({
			where: {
				id: friendId
			}
		})
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship = await this.prisma.friendShip.findFirst ({
			where: {
				InitiatorId: userId,
				AcceptorId: friend.id
			}
		})
		console.log ("hehehehhe");
		if (!friendship) {
			await this.prisma.friendShip.create ({
				data: {
					status: FRIENDSHIPSTATUS.PENDING,
					InitiatorId: userId,
					AcceptorId: friend.id,
				}
			})
			/// send notification to user
		}
	}
	//delete a friend
	async delete (userId: number, friendId: number) {
		const friend = await this.prisma.user.findUnique ({
			where: {
				id: friendId
			}
		})
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship = await this.prisma.friendShip.findFirst ({
			where: {
				OR: [
					{
						InitiatorId: userId,
						AcceptorId: friend.id
					},
					{
						InitiatorId: friend.id,
						AcceptorId: userId
					}
				]
			}
		})
		if (!friendship)
			throw new HttpException ("not friends", HttpStatus.BAD_REQUEST)
		await this.prisma.friendShip.delete ({
			where: {
				id: friendship.id
			}
		})
	}
	// block a friend
	async block (userId: number, friendId: number) {
		const friend = await this.prisma.user.findUnique ({
			where: {
				id: friendId
			}
		})
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship = await this.prisma.friendShip.findFirst ({
			where: {
				OR: [
					{
						InitiatorId: userId,
						AcceptorId: friend.id
					},
					{
						InitiatorId: friend.id,
						AcceptorId: userId
					}
				]
			}
		})
		if (!friendship)
				throw new HttpException ("not friends", HttpStatus.BAD_REQUEST)
		if (friendship.status === FRIENDSHIPSTATUS.FRIEND) {
			if (friendship.InitiatorId === userId) {
				await this.prisma.friendShip.update({
					where: {
						id: friendship.id
					},
					data: {
						status: FRIENDSHIPSTATUS.BLOCKED
					}
				})
			}
		}

	}
	// unblock a friend
	async unblok (userId: number, friendId: number) {
		const friend = await this.prisma.user.findUnique ({
			where: {
				id: friendId
			}
		})
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship = await this.prisma.friendShip.findFirst ({
			where: {
				InitiatorId: userId,
				AcceptorId: friend.id
			}
		})
		if (!friendship)
				throw new HttpException ("not friends", HttpStatus.BAD_REQUEST)
		if (friendship.status === FRIENDSHIPSTATUS.BLOCKED) {
			await this.prisma.friendShip.update ({
				where: {
					id: friendship.id
				},
				data: {
					status: FRIENDSHIPSTATUS.FRIEND
				}
			})
		}
	}
}
