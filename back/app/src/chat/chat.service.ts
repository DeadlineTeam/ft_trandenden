import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import { FriendService } from 'src/friend/friend.service';
import { UsersService } from 'src/users/users.service';
import { MemberService } from 'src/member/member.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
	constructor (
		@Inject (forwardRef (() => ChatGateway))
		private readonly chatGateway: ChatGateway,
		private readonly message: MessageService,
		private readonly friend: FriendService,
		private readonly member: MemberService,
		) {}

	async createMessage (senderId: number, message: {content: string, roomId: number}) {
		if (!message.content || !message.roomId)
			return;
		// check if the user is a member of the room
		// or if the user is banned or muted
		// don't save create the message
		const member = await this.member.getMember (message.roomId, senderId);
		if (!member || member.banned || member.muted)
			return;

		const newMessage = await this.message.newMessage (senderId, message);
		if (newMessage) {
			const blockedFriends = await this.friend.BlockedFriends (senderId);
			const broadcastTo = await this.member.getMembersIds (message.roomId);
			const broadcastToUnblocked = broadcastTo.filter (id => !blockedFriends.includes (id));
			const messageFormated = this.message.messageFormate (newMessage);
			console.log (broadcastToUnblocked);
			this.chatGateway.broadcastToRoom ("message", message.roomId, broadcastToUnblocked, messageFormated);
		}
	}
}
