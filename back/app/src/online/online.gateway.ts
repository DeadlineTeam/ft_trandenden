import { 
		WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		WebSocketServer,
		ConnectedSocket,
							} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { OnlineService } from './online.service';
import { UsersService } from 'src/users/users.service';
import { Inject, forwardRef } from '@nestjs/common';
					
@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "online"
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (
				@Inject (forwardRef (() => OnlineService))
				private readonly onlineService: OnlineService,
				private readonly authService: AuthService,
				private readonly userService: UsersService,
				) {}

	@WebSocketServer ()
	server;

	async handleConnection (@ConnectedSocket () client: Socket) {
		const payload 	= this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		if (!payload) {
			client.disconnect ();
			return false;
		}
		try {
			const user = await this.userService.findById (payload.sub);
			if (!user) {
				client.disconnect ();
				return false;
			}
			await this.onlineService.setOnline (payload.sub, true);
			client.data.id = payload.sub;
			client.join (payload.sub.toString ());
			
		} catch (e) {
			client.disconnect ();
			return ;
		}
	}

	

	async handleDisconnect(client: Socket) {
		if (!client.data.id) {
			return ;
		}
		client.leave (client.data.id.toString ());
		const room = this.server.adapter.rooms.get (client.data.id.toString ());
		if (room == undefined) {
			try {
				this.onlineService.setOnline (client.data.id, false);
			} catch (e) {
				return ;
			}
		}
	}
}
