import { Socket } from "socket.io";
import { SIDE} from "../interfaces/game.interface"
import { Interval } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { Pong } from "./match.service";
import { User } from "@prisma/client";
import { UsersService } from "src/users/users.service";
import { SocketUserService } from "./SocketUserService";


type Queue = {
	Normal: Array<Socket>
	Ultimate: Array<Socket>
}

interface holder <T> {
	leftPlayer: T,
	rightPlayer: T
}


@Injectable ()
export class GameService {
	constructor (
		private readonly userService: UsersService,
		private readonly socketUserService: SocketUserService,
	) {}

	queues: Queue = { Normal: [], Ultimate: []}
	matches: Map<string, Pong> = new Map ();

	static emitRoom (match: Pong, event: string, ...args: any): void {
		for (const p of match.game.players)
			p.socket.emit (event, ...args);
	}
	async Matching (queue: Array<Socket>): Promise<void> {
		if (queue.length >= 2) {
			const match: Pong = new Pong ();
			const players: holder <Socket> = {
				leftPlayer: queue.shift (),
				rightPlayer: queue.shift ()
			}
			const event: holder <User | null> = {leftPlayer: null, rightPlayer: null}
			for (const p in players) {
				match.addPlayer (players[p])
				const user: User | null = await this.userService.findbylogin (this.socketUserService.get(players[p].id));
				event[p] = user
			}
			for (const [p, u] of Object.entries (event))
				GameService.emitRoom (match, p, u)
			this.matches.set (match.id, match);
		}
		else {
			const socket: Socket = queue[0];
			const player = await this.userService.findbylogin (this.socketUserService.get (socket.id))
			socket.emit ('leftPlayer', player)
		}
	}
	async joinQueue (socket: Socket, mode: string) {
		this.queues[mode].push (socket)
		this.Matching (this.queues[mode]);
	}
	
	leaveMatch (socket: Socket): void {
		const match: Pong = this.findMatch (socket);
		if (match) {
			GameService.emitRoom (match, "end")
			for (const c of match.game.players) {
				this.socketUserService.remove (c.socket.id);
			}
			this.matches.delete (match.id)
		}
	}
	
	findMatch (client: Socket): Pong {
		for (const match of this.matches.values ()) {
			if (match.isPlaying (client))
				return match;
		}
	}

	handleInput (client: Socket, data: string): void {
		const match: Pong = this.findMatch (client);
		if (match) {
			const side: SIDE = (match.game.players[SIDE.LEFT].socket.id === client.id)? SIDE.LEFT: SIDE.RIGHT;
			match.handleInput (side, data)
			GameService.emitRoom (match, "paddle", side, match.game.players[side].paddle.position)
		}
	}

	@Interval (1000/60)
	gameLoop (): void {
		for (const match of this.matches.values ()) {
			match.update ()
			if (match.scored) {
				GameService.emitRoom (match, "score", match.game.players.map ((p) => p.score))
				match.reset ();
			}
			if (match.isFinished ()) {
					// set match as finished
					GameService.emitRoom (match, "end");
					// save game to GameHistory
					//
					// remove match from  matches
					this.matches.delete (match.id)
			
			}
			else {
				GameService.emitRoom (match, "ball", match.game.ball.position)
			}
		}
	}
}