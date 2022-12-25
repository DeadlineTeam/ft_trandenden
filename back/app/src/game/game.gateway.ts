import { ConnectedSocket, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets"
import { Inject, forwardRef} from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { GameService, LiveMatch } from "./services/game.service";
import { SocketUserService } from "./services/SocketUserService";

@WebSocketGateway ({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "playgame"
})


export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection {
	constructor (
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
		private readonly authService: AuthService,
		private readonly socketUserService: SocketUserService,
	) {}
		
	@WebSocketServer ()
	server: Server;
	
	static LiveGameRoom: string = "LiveGames";
		
	handleConnection(@ConnectedSocket () client: Socket) {		
		const payload = this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		if (!payload) {
			client.disconnect ();
			return ;
		}
		this.socketUserService.insert (client.id, payload?.username);
	}

	handleDisconnect(@ConnectedSocket () client: Socket) {
		this.gameService.leaveMatch (client)
		this.socketUserService.remove (client.id);
	}

	@SubscribeMessage ("input")
	handleInput (@ConnectedSocket () client: Socket, @MessageBody () data: string): void {
		this.gameService.handleInput (client, data);
	}
	
	@SubscribeMessage ("join")
	async joinQueue (@ConnectedSocket () client: Socket, @MessageBody () mode: string) {
		this.gameService.joinQueue (client, mode);
	}

	@SubscribeMessage ("watch")
	watchGame (@ConnectedSocket () client: Socket, @MessageBody () id: string) {
		this.gameService.watchGame (client, id);
	}

	@SubscribeMessage ("LiveGames")
	joinRoomForBroadcast (@ConnectedSocket () client: Socket) {
		// console.log (client.id, "wants to watch games")
		client.join (GameGateway.LiveGameRoom);
		this.gameService.LiveGameBroadcast ()

	}
	@SubscribeMessage ("noBroadcast")
	leaveBroadcastRoom (@ConnectedSocket () client: Socket) {
		console.log (client.id, "no broadcast ")
		client.leave (GameGateway.LiveGameRoom)
	}

	broadCastLiveGames (liveMatches: LiveMatch []) {
		// console.log ("back ----->", liveMatches)
		this.server.to (GameGateway.LiveGameRoom).emit (GameGateway.LiveGameRoom, liveMatches);
	}


}
