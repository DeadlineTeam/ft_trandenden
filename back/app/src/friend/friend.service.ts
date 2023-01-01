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

	async getFriendShip (userId: number, friendId: number) {
		return await this.prisma.friendShip.findFirst ({
			where: {
				InitiatorId: userId,
				AcceptorId: friendId
			}
		});
	}

	async friendStatus (userId: number, friendId: number) {
        const friend = await this.getFriendShip (userId, friendId);
        if (!friend)
            return "NOT_FRIENDS";
        else if (friend.status === FRIENDSHIPSTATUS.BLOCKED)
            return "BLOCKED";
        else if (friend.status === FRIENDSHIPSTATUS.FRIEND)
            return "FRIENDS";
    }

	async createFriendShip (userId: number, friendId: number) {
		await this.prisma.friendShip.create ({
			data: {
				status: FRIENDSHIPSTATUS.FRIEND,
				InitiatorId: userId,
				AcceptorId: friendId,
			}
		});
		await this.prisma.friendShip.create ({
			data: {
				status: FRIENDSHIPSTATUS.FRIEND,
				InitiatorId: friendId,
				AcceptorId: userId,
			}
		});
	}

	async add (userId: number, friendId: number) {
		if (userId === friendId)
			throw new HttpException ("you can't add yourself", HttpStatus.BAD_REQUEST)
		const friend = await this.user.findById (friendId);
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship1 = await this.getFriendShip (userId, friend.id);
		if (friendship1)
			throw new HttpException ("already friends", HttpStatus.BAD_REQUEST)
		const friendship2 = await this.getFriendShip (friend.id, userId);
		if (friendship2)
			throw new HttpException ("already friends", HttpStatus.BAD_REQUEST)
		return await this.createFriendShip (userId, friend.id);
	}

	// we don't need to delete a friend, we just need to block him
	// //delete a friend
	// async delete (userId: number, friendId: number) {
	// 	const friend = await this.prisma.user.findUnique ({
	// 		where: {
	// 			id: friendId
	// 		}
	// 	})
	// 	if (!friend)
	// 		throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
	// 	const friendship = await this.prisma.friendShip.findFirst ({
	// 		where: {
	// 			OR: [
	// 				{
	// 					InitiatorId: userId,
	// 					AcceptorId: friend.id
	// 				},
	// 				{
	// 					InitiatorId: friend.id,
	// 					AcceptorId: userId
	// 				}
	// 			]
	// 		}
	// 	})
	// 	if (!friendship)
	// 		throw new HttpException ("not friends", HttpStatus.BAD_REQUEST)
	// 	await this.prisma.friendShip.delete ({
	// 		where: {
	// 			id: friendship.id
	// 		}
	// 	})
	// }


	// block a friend
	async block (userId: number, friendId: number) {
		const friend = await this.user.findById (friendId);
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship = await this.getFriendShip (userId, friend.id);
		if (!friendship)
				throw new HttpException ("not friends", HttpStatus.BAD_REQUEST)
		if (friendship.status === FRIENDSHIPSTATUS.FRIEND) {
			await this.prisma.friendShip.update({
				where: {
					id: friendship.id
				},
				data: {
					status: FRIENDSHIPSTATUS.BLOCKED
				}
			})
		}
		else {
			throw new HttpException ("already blocked", HttpStatus.BAD_REQUEST)
		}

	}
	// unblock a friend
	async unblock (userId: number, friendId: number) {
		const friend = await this.user.findById (friendId);
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		const friendship = await this.getFriendShip (userId, friend.id);
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
		else {
			throw new HttpException ("already unblocked", HttpStatus.BAD_REQUEST)
		}
	}

	async getall (userId: number) {
		const friends = await this.prisma.friendShip.findMany ({
			where: {
				InitiatorId: userId,
			},
		})
		return (friends.map ((friend) => friend.AcceptorId))
	}

	async getStatus (userId: number, friendId: number) {
		const friend = await this.user.findById(friendId)
		if (!friend)
			throw new HttpException ("no friend with that id exist", HttpStatus.BAD_REQUEST)
		
		const friendship = await this.getFriendShip (userId, friend.id);
		if (!friendship)
			return "not friends"
		else if (friendship.status === FRIENDSHIPSTATUS.BLOCKED)
			return "blocked"
	}

	async BlockedFriends (userId: number) {
		const blocked = await this.prisma.friendShip.findMany ({
			where: {
				OR: [
					{
						InitiatorId: userId,
						status: FRIENDSHIPSTATUS.BLOCKED
					},
					{
						AcceptorId: userId,
						status: FRIENDSHIPSTATUS.BLOCKED
					},
				]
			},
			include: {
				Initiator: true,
				Acceptor: true
			},
		});
		return blocked.map ((friend) => {
			if (friend.InitiatorId === userId)
				return friend.Acceptor.id;
			else
				return friend.Initiator.id;
		})

	}

}
