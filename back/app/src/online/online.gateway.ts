import { 
		WebSocketGateway,
		OnGatewayConnection,
		OnGatewayDisconnect,
		WebSocketServer,
		ConnectedSocket,
							} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
					
@WebSocketGateway({
	cors: {
		origin: 'http://localhost:3000',
		credentials: true
	},
	namespace: "online"
})
export class OnlineGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor (
				private readonly authService: AuthService,
				private readonly prisma: PrismaService,
				) {}

	@WebSocketServer ()
	server;

	async handleConnection (@ConnectedSocket () client: Socket) {
		const payload 	= this.authService.verify(decodeURI (client.handshake?.headers?.cookie).replace ("Authorization=Bearer ", ""))
		if (!payload) {
			client.disconnect ();
			return false;
		}
		await this.prisma.user.update ({
			where: {
				id: payload.sub
			},
			data: {
				online: true
			}
		})
		client.join (payload.sub.toString ());
		this.server.emit (`online${payload.sub}`);
	}

	async handleDisconnect(client: Socket) {
		client.leave (client.data.id.toString ());
		const room = this.server.adapter.rooms.get (client.data.id.toString ());
		if (room == undefined) {
			await this.prisma.user.update ({
				where: {
					id: client.data.id
				},
				data: {
					online: false
				}
			})
			this.server.emit (`offline${client.data.id}`);
		}
	}
}
