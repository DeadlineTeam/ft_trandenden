import { ConnectedSocket, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection } from "@nestjs/websockets";
import { WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets"
import { Inject, forwardRef, ExecutionContext} from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { GameService, LiveMatch } from "./services/game.service";
import { UsersService } from "src/users/users.service";
import { WsAuthGuardConnect } from "src/auth/ws-auth.guard";
import { WsAuthGuard } from "src/auth/ws-auth.guard";
import { UseGuards } from "@nestjs/common";
@WebSocketGateway ({
	cors: {
		origin: `${process.env.FRONTENDURL}`,
		credentials: true
	},
	namespace: "playgame"
})


export class GameGateway implements OnGatewayDisconnect, OnGatewayConnection {
	constructor (
		@Inject(forwardRef(() => GameService))
		private readonly gameService: GameService,
		private readonly authService: AuthService,
		private readonly userService: UsersService,
	) {}
		
	@WebSocketServer ()
	server: Server;
	
	static LiveGameRoom: string = "LiveGames";
	

	async handleConnection(@ConnectedSocket () client: Socket) {		
		const wsAuthGuard = new WsAuthGuardConnect(this.authService, this.userService);
		try {
			await wsAuthGuard.canActivate (client);
		}
		catch (e) {
			client.disconnect ();
			return ;
		}

	}

	handleDisconnect(@ConnectedSocket () client: Socket) {}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("join")
	async joinQueue (@ConnectedSocket () client: Socket, @MessageBody () mode: string) {
		const status = await this.userService.getStatus (client.data.id);
		if (status.inGame === true){
			client.emit ("end");
			return ;
		}
		this.gameService.joinQueue (client, mode);
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("leave")
	leaveQueue (@ConnectedSocket () client: Socket) {
		this.gameService.leaveMatch (client);
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("input")
	handleInput (@ConnectedSocket () client: Socket, @MessageBody () data: string): void {
		this.gameService.handleInput (client, data);
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("watch")
	async watchGame (@ConnectedSocket () client: Socket, @MessageBody () id: string) {
		const status = await this.userService.getStatus (client.data.id);
		if (status.inGame === true){
			client.emit ("end");
			return ;
		}
		this.gameService.watchGame (client, id);
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("LiveGames")
	joinRoomForBroadcast (@ConnectedSocket () client: Socket) {
		client.join (GameGateway.LiveGameRoom);
		this.gameService.LiveGameBroadcast ()
	}

	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("noBroadcast")
	leaveBroadcastRoom (@ConnectedSocket () client: Socket) {
		client.leave (GameGateway.LiveGameRoom)
	}

	
	@UseGuards(WsAuthGuard)
	@SubscribeMessage ("invite")
	invite (@ConnectedSocket () client: Socket, @MessageBody () id: string) {
		this.gameService.gameInvite (client, id);
	}

	broadCastLiveGames (liveMatches: LiveMatch []) {
		this.server.to (GameGateway.LiveGameRoom).emit (GameGateway.LiveGameRoom, liveMatches);
	}
}
