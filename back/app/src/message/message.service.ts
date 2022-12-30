import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendService } from 'src/friend/friend.service';
import { MemberService } from 'src/member/member.service';
import { HttpException } from '@nestjs/common';

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
}