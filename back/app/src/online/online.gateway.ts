import { 
		WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		WebSocketServer,
		ConnectedSocket,
							} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { OnlineService } from './online.service';
import { UsersService } from 'src/users/users.service';
import { Inject, forwardRef } from '@nestjs/common';

import { WsAuthGuardConnect } from "src/auth/ws-auth.guard";
import { WsAuthGuard } from "src/auth/ws-auth.guard";
import { UseGuards } from "@nestjs/common";
import { SubscribeMessage } from "@nestjs/websockets";

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
		const wsAuthGuard = new WsAuthGuardConnect(this.authService, this.userService);
		try {
			await wsAuthGuard.canActivate (client);
			await this.onlineService.setOnline (client.data.id, true);
			client.join (client.data.id.toString ());
		}
		catch (e) {
			client.disconnect ();
			return ;
		}
	}

	
	async handleDisconnect(client: Socket) {
		
		const wsAuthGuard = new WsAuthGuardConnect(this.authService, this.userService);
		try {
			await wsAuthGuard.canActivate (client);
			client.leave (client.data.id.toString ());
			const room = this.server.adapter.rooms.get (client.data.id.toString ());
			if (!room) {
				await this.onlineService.setOnline (client.data.id, false);
			}
		}
		catch (e) {
			client.disconnect ();
			return ;
		}
	}


	// @UseGuards(WsAuthGuard)
	// @SubscribeMessage ("logout")
	// async logout (client: Socket) {
	// 	console.log ("logout");
	// 	client.leave (client.data.id.toString ());
	// 	const room = this.server.adapter.rooms.get (client.data.id.toString ());
	// 	if (!room) {
	// 		await this.onlineService.setOnline (client.data.id, false);
	// 	}
	// }

	// // @UseGuards(WsAuthGuard)
	// @SubscribeMessage ("login")
	// async login (client: Socket) {
	// 	console.log ("login");
	// 	await this.onlineService.setOnline (client.data.id, true);
	// 	client.join (client.data.id.toString ());
	// }
}
