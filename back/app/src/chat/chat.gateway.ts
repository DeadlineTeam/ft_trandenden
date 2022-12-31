import {
		ConnectedSocket,
		MessageBody,
		OnGatewayConnection,
		OnGatewayDisconnect,
		SubscribeMessage,
		WebSocketGateway, 
		WebSocketServer} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from './chat.service';
import { MemberService } from 'src/member/member.service';
import { forwardRef, Inject } from '@nestjs/common';

@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "chat"
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (
		@Inject(forwardRef(() => ChatService))
		private readonly chatservice: ChatService,
		private readonly authService: AuthService,
		private readonly memberService: MemberService,
	) {}
	@WebSocketServer ()
	server;

	async handleConnection (@ConnectedSocket () client: Socket) {
		const payload = this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""));
		if (!payload) {
			client.disconnect ();
			return ;
		}
		client.data.id = payload.sub;
		const userId = payload.sub;
		const rooms = await this.memberService.getRooms(userId);
		rooms.forEach(room => {
			client.join(room.roomId.toString());
		});
	}

	async handleDisconnect(client: Socket) {}

	@SubscribeMessage('message')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
		try {
			const createMessage = JSON.parse(data);
			this.chatservice.createMessage(client.data.id, createMessage);
		} catch {
		}
	}

	broadcastToRoom (eventName: string, RoomId: number, filterIds: number[], message: any) {
		const room = this.server.adapter.rooms.get (RoomId.toString());
		if (room) {
			room.forEach (socketId => {
				const socket = this.server.sockets.get (socketId);
				if (socket && filterIds.includes (socket.data.id)) {
					socket.emit (eventName, message);
				}
			})
		}
	}
}
