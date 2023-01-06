import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendService } from 'src/friend/friend.service';
import { MemberService } from 'src/member/member.service';
import { HttpException } from '@nestjs/common';
import { CreateMessageDto } from 'src/chat/dto/message.dto';

@Injectable()
export class MessageService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly friend: FriendService,
		private readonly member: MemberService,
	) {}

	messageFormate (message: any) {
		return {
			messageId: message.messageId,
			roomId: message.roomId,
			senderId: message.senderId,
			senderUserName: message.sender.username,
			senderAvatar: message.sender.avatar_url,
			content: message.content,
			sentTime: message.sentTime,
		};
	}
	async getRoomMessages(userId: number, roomId: number) {
		//check if the user is a member of the room
		const member = await this.member.getMember(roomId, userId);
		if (!member) {
			throw new HttpException('User is not a member of the room', 403);
		}
		// get all messages in the room
		const messages = await this.prisma.message.findMany({
			where: {
				roomId: roomId,
			},
			include: {
				sender: true,
			},
			orderBy: {
				sentTime: 'asc',
			},
		});

		// check if the message is sent by non blocked user and the user is not blocked
		let filteredMessages = [];
		for (const msg of messages) {
			const status = await this.friend.getStatus(msg.senderId, userId);
			if (status !== 'blocked') {
				filteredMessages.push(msg);	
			}
		}
		return filteredMessages.map(this.messageFormate);
	}
	async getRoomUserMessages (userId:number, roomId:number, userID:number) {
		const member = await this.member.getMember(roomId, userID);
		if (!member) {
			throw new HttpException('User is not a member of the room', 403);
		}
		const messages = await this.prisma.message.findMany({
			where: {
				roomId: roomId,
				senderId: userID,
			},
			select: {
				senderId:true,
				sentTime:true,
				content:true,
			},
			orderBy: {
				sentTime: 'asc',
			}
		});

		return messages;
	}

	async newMessage (senderId: number, message: CreateMessageDto) {
		const room = await this.prisma.room.findFirst({
			where: {
				id: message.roomId,
			},
			include: {
				users: true,
			}
		});
		if (!room) return room;
		// check if the room visibility is DM and the receiver did not block the sender
		if (room.visibility === 'DM') {
			// get the other user in the room
			const receiverId = room.users.filter(member => member.userId !== senderId)[0].userId;
			const status = await this.friend.getStatus(receiverId, senderId);
			if (status === 'blocked') {
				return null;
			}
		}
		else {
			//check if the sender is not muted
			const member = await this.member.getMember(message.roomId, senderId);
			if (member) {
				if (member.muted) {
					return null;
				}
			}
		}
		const newMessage = await this.prisma.message.create ({
			data: {
				content: message.content,
				room: {
					connect: {
						id: message.roomId,
					}
				},
				sender: {
					connect: {
						id: senderId,
					}
				},
			},
			include: {
				sender: true,
			}
		})
		return newMessage;
	}
}