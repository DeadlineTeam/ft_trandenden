import { ConnectedSocket, WebSocketGateway } from "@nestjs/websockets";
import { WebSocketServer, SubscribeMessage, MessageBody } from "@nestjs/websockets"
import { GameService } from "./services/game.service";
import { Server, Socket } from "socket.io";

@WebSocketGateway ({
	cors: '*',
	namespace: "/playgame"
})


export class GameGateway {
	constructor (private readonly gameService: GameService) {}

	@WebSocketServer ()
	server: Server;

	@SubscribeMessage ("play")
	setToPlay (@ConnectedSocket () client: Socket, @MessageBody () data: string): void {
		//console.log (data)
		this.gameService.joinQueue(client, data);
	}

	@SubscribeMessage ("disconnect")
	handleDisconnect (@ConnectedSocket () client: Socket, @MessageBody () data: string): void {
		this.gameService.leaveMatch (client);
	}

	@SubscribeMessage ("input")
	handleInput (@ConnectedSocket () client: Socket, @MessageBody () data: string): void {
		this.gameService.handleInput (client, data);
	}

}