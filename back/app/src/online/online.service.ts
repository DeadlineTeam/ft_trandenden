import { forwardRef, Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { OnlineGateway } from "./online.gateway";
import { Inject } from "@nestjs/common";

import { GameInvite } from "./types/gameInvite";

@Injectable ()
export class OnlineService {
	constructor (
		@Inject (forwardRef (() => OnlineGateway))
		private readonly onlineGateway: OnlineGateway,
		private readonly userService: UsersService,
	) {}

	async setOnline (id: number, online: boolean) {
		await this.userService.setOnline (id, online);
		this.onlineGateway.server.emit (online? 'online': 'offline', id);
	}

	async setInGame (id: number, inGame: boolean) {
		await this.userService.setInGame (id, inGame);
		this.onlineGateway.server.emit (inGame? 'inGame': 'offGame', id);
	}

	async notify (id: number, type: string, message: any) {
		if (type === "GameInvite") {
			const gameInvite = <GameInvite> message;
			this.onlineGateway.server.to (id.toString ()).emit (`notification`, {
				type: "GameInvite",
				message: gameInvite,
			});
		}

		if (type === "GameInviteDeclined") {
			this.onlineGateway.server.to (id.toString ()).emit (`notification`, {
				type: "GameInviteDeclined",
				message: message,
			});
		}

		if (type === "friendship") {
			this.onlineGateway.server.to (id.toString ()).emit (`notification`, {
				type: "friendship",
				message: message,
			});
		}
		if (type === "message") {
			this.onlineGateway.server.to (id.toString ()).emit (`notification`, {
				type: "message",
				message: message,
			});
		}
	}

	logout (id: number) {
		this.onlineGateway.server.to (id.toString ()).emit (`logout`);
	}

	broadcast (event: string, action: string, userId: number, roomId: number) {
		this.onlineGateway.server.to (userId.toString ()).emit (event, {
			action: action,
			roomId: roomId
		})
	}

}