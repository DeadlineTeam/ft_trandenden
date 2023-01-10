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
import { WsAuthGuardConnect } from 'src/auth/ws-auth.guard';
import { UsersService } from 'src/users/users.service';
import { WsAuthGuard } from 'src/auth/ws-auth.guard';
import { UseGuards } from '@nestjs/common';

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
		private readonly userService: UsersService,
	) {}
	@WebSocketServer ()
	server;

	userIdToSocket: Map <number, Socket[]> = new Map ();

	async handleConnection (@ConnectedSocket () client: Socket) {
		const wsAuthGuard = new WsAuthGuardConnect(this.authService, this.userService);
		try {
			await wsAuthGuard.canActivate(client);
			const userId = client.data.id;
			const rooms = await this.memberService.getRooms(userId);
			rooms.forEach(room => {
				client.join(room.roomId.toString());
			})
			const idtosockets = this.userIdToSocket.get (client.data.id);
			if (!idtosockets)
				this.userIdToSocket.set (client.data.id, [])
			this.userIdToSocket.get(client.data.id).push (client);
			console.log ("chat socket");
		}
		catch (e) {
			client.disconnect ();
			return ;
		}
	}

	async handleDisconnect(client: Socket) {
		const wsAuthGuard = new WsAuthGuardConnect(this.authService, this.userService);
		try {
			await wsAuthGuard.canActivate(client);
			this.userIdToSocket.get (client.data.id).filter (socket => socket.id !== client.id);
		}
		catch (e) {
			client.disconnect ();
			return ;
		}
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage('message')
	async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: {roomId: number, content: string}) {
		// const createMessage = JSON.parse(data);
		console.log (data);
		try {
			this.chatservice.createMessage(client.data.id, data);
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

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ('join')
	joinRoom (@ConnectedSocket () client: Socket, @MessageBody() data: {roomId: number}) {
		client.join (data.roomId.toString())
		this.userIdToSocket.get (client.data.id).forEach ((socket, key) => {
			socket.emit ('update');
		})
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ('leave')
	leaveRoom (@ConnectedSocket () client: Socket, @MessageBody() data: {roomId: number}) {
		client.leave (data.roomId.toString())
		this.userIdToSocket.get (client.data.id).forEach ((socket, key) => {
			socket.emit ('update');
		})
	}
}
