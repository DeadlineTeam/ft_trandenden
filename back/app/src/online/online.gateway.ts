import { 
		WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		SubscribeMessage,
		WebSocketServer,
		ConnectedSocket,
							} from '@nestjs/websockets';
import { GateWayGuard } from './gatway.guard';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnlineService } from './online.service';
import { AuthService } from 'src/auth/auth.service';
					
@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "online"
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (private readonly onlineService: OnlineService,
				private readonly authService: AuthService) {}

	@WebSocketServer ()
	server: Server;

	// @UseGuards (GateWayGuard)
	async handleConnection (@ConnectedSocket () client: Socket) {
		const payload 	= this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		console.log ("hellollo")
		console.log (payload);
		if (!payload) {
			client.disconnect ();
			return false;
		}
	}

	@SubscribeMessage("online")
	async online (@ConnectedSocket () client: Socket, data: {userId: number}) {
		console.log ("online");
	}
	async handleDisconnect(client: Socket) {
	
	}
}
