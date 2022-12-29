import {
	ConnectedSocket,
		OnGatewayConnection,
		OnGatewayDisconnect,
		SubscribeMessage,
		WebSocketGateway, 
		WebSocketServer} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ChatService } from './chat.service';



@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "chat"
})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (
		private readonly chatservice: ChatService,
		private readonly authService: AuthService,
		private readonly userService: UsersService
	) {}
	@WebSocketServer ()
	server: Server;

	
	async handleConnection (@ConnectedSocket () client: Socket) {
		const payload = this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		if (!payload) {
			client.disconnect ();
			return ;
		}
	}

	async handleDisconnect(client: Socket) {
		
	}

}
