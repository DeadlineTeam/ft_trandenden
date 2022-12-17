import { Socket } from "socket.io";
import { SIDE} from "../interfaces/game.interface"
import { Interval } from "@nestjs/schedule";
import { Injectable } from "@nestjs/common";
import { Pong } from "./match.service";

@Injectable ()
export class GameService {
	queue: Array<Socket> = []
	standardQueue: Array<Socket> = []
	nonStandardQueue: Array<Socket> = []
	matches: Map<string, Pong> = new Map ();

	
	static emit (match: Pong, event: string, ...args: any): void {
		for (const p of match.game.players)
			p.socket.emit (event, ...args);
	}

	joinQueue (socket: Socket, data: string) {
		console.log ("client wants to join queue for" + data + "mode");
		if (data === "standard") {
			this.standardQueue.push (socket);
		}
		else if (data === "nonstandard") {
			this.nonStandardQueue.push (socket);
		}
		if (this.standardQueue.length >= 2) {
			const match: Pong = new Pong ();
			match.addPlayer (this.standardQueue.shift ())
			match.addPlayer (this.standardQueue.shift ())
			GameService.emit (match, "setup", {
				windowRation: match.game.windowRatio,
				ballradius: match.game.ball.radius,
				paddleDimension: match.game.players[0].paddle.dimension,
			})
			this.matches.set (match.id, match);
		}
		if (this.nonStandardQueue.length >= 2) {
			const match: Pong = new Pong ();
			match.addPlayer (this.nonStandardQueue.shift ())
			match.addPlayer (this.nonStandardQueue.shift ())
			GameService.emit (match, "setup", {
				windowRatio: match.game.windowRatio,
				ballradius: match.game.ball.radius,
				paddleDimension: match.game.players[0].paddle.dimension,
			})
			this.matches.set (match.id, match);
		}
	}
	
	leaveMatch (socket: Socket): void {
		console.log ("client disconnect", socket.id)
		this.queue = this.queue.filter ((client) => (client.id != socket.id))
		const match: Pong = this.findMatch (socket);
		if (match) {
			GameService.emit (match, "end")
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
			GameService.emit (match, "paddle", (side === SIDE.LEFT)?"left":"right", match.game.players[side].paddle.position)	
		}
	}

	@Interval (1000/60)
	gameLoop (): void {
		for (const match of this.matches.values ()) {
			match.update ()
			if (match.scored) {
				GameService.emit (match, "score", match.game.players.map ((p) => p.score))
				match.reset ();
			}
			GameService.emit (match, "ball", match.game.ball.position)
		}
	}

}