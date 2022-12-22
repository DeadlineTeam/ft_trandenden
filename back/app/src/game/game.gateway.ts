import { ConnectedSocket, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets"
import { GameService } from "./services/game.service";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";

@WebSocketGateway ({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "playgame"
})


export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection {
	constructor (
		private readonly gameService: GameService,
		private readonly authService: AuthService,
	) {}

	@WebSocketServer ()
	server: Server;
	
	SocketUser: Map<string, string> = new Map ();
	
	handleConnection(@ConnectedSocket () client: Socket) {		
		const payload = this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		if (!payload) {
			client.disconnect ();
			return ;
		}
		this.SocketUser.set (client.id, payload?.username);
	}

	handleDisconnect(@ConnectedSocket () client: Socket) {
		this.gameService.leaveMatch (client)
	}

	@SubscribeMessage ("input")
	handleInput (@ConnectedSocket () client: Socket, @MessageBody () data: string): void {
		this.gameService.handleInput (client, data);
	}
	
	@SubscribeMessage ("join")
	async joinQueue (@ConnectedSocket () client: Socket, @MessageBody () data: string) {
		this.gameService.joinQueue (client, data, this.SocketUser);
	}
}
