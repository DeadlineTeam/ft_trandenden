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
		const user = await this.userService.findById (id);
		if (online === true) {
			if (user.online === false) {
				await this.userService.setOnline (id, true);
				this.userService.setOnline (id, true);
				this.userService.setInGame (id, false);
				this.onlineGateway.server.emit (`online${id}`);
			}
			else if (user.online === true) {
				if (user.inGame === true) {
					this.onlineGateway.server.emit (`inGame${id}`);
				}
				else {
					this.onlineGateway.server.emit (`online${id}`);
				}
			}
		}
		else if (online === false) {
			if (user.online === true) {
				await this.userService.setOnline (id, false);
				await this.userService.setInGame (id, false);
				this.onlineGateway.server.emit (`offline${id}`);
			}
			else if (user.online === false) {
				this.onlineGateway.server.emit (`offline${id}`);
			}
		}
	}

	async setInGame (id: number, inGame: boolean) {
		await this.userService.setInGame (id, inGame);
		await this.setOnline (id, true);
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
	}

	logout (id: number) {
		this.onlineGateway.server.to (id.toString ()).emit (`logout`);
	}

}