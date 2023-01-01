import { Socket } from "socket.io";
import { SIDE} from "../interfaces/game.interface"
import { Interval } from "@nestjs/schedule";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Pong } from "./match.service";
import { GameGateway } from "../game.gateway";
import { PrismaService } from "src/prisma/prisma.service";
import { gameMode } from "@prisma/client";


type Queue = {
	Normal: Array<Socket>
	Ultimate: Array<Socket>
}

interface holder <T> {
	leftPlayer: T,
	rightPlayer: T
}



export interface LiveMatch {
	id: string,
	leftPlayer: {
		user: string
		avatar: string
	},
	rightPlayer: {
		user: string
		avatar: string
	}
}

export type LiveMatches = typeof Array<LiveMatch>

@Injectable ()
export class GameService {
	constructor (
		@Inject(forwardRef(() => GameGateway))
		private readonly gateWay: GameGateway,
		private readonly prisma: PrismaService,
	) {}

	queues: Queue = { Normal: [], Ultimate: []}
	matches: Map<string, Pong> = new Map ();

	static emitRoom (match: Pong, event: string, ...args: any): void {
		for (const p of match.game.players)
			p.socket.emit (event, ...args);
		for (const s of match.game.watchers)
			s.emit (event, ...args)
	}


	async startMatch (match: Pong) {
		this.matches.set (match.id, match);
		this.LiveGameBroadcast ();
	}
	
	async Matching (queue: Array<Socket>, mode: string): Promise<void> {

		let pSockets: Array<Socket> = [] 
		for (let i = 0; i < queue.length - 1; i++) {
			if (queue[i].data.id !== queue[i + 1].data.id) {
				pSockets = queue.splice (i, 2);
				delete queue [i];
				delete queue [i + 1];
				break
			}
		}

		if (pSockets.length) {
			const match = new Pong (mode);
			pSockets.forEach ((s) => { match.addPlayer (s)})
			GameService.emitRoom (match, "leftPlayer", pSockets[0].data)
			GameService.emitRoom (match, "rightPlayer", pSockets[1].data)
			this.startMatch (match)
		}
	}

	async joinQueue (socket: Socket, mode: string) {	
		socket.emit ('leftPlayer', socket.data)
		this.queues[mode].push (socket)
		this.Matching (this.queues[mode], mode);
	}

	async watchGame (socket: Socket, id: string) {
		const match = this.matches.get (id)
		if (match) {
			match.addWatcher (socket);
			const event = {
					leftPlayer: match.game.players[0].socket.data,
					rightPlayer: match.game.players[1].socket.data 
				};
			for (const [p, u] of Object.entries (event)) {
				socket.emit (p, u);
			}
			socket.emit("score", match.game.players.map ((p) => p.score))
		}
		else {
			socket.emit ('end');
		}
	}
	
	leaveMatch (socket: Socket): void {
		const match: Pong = this.findMatch (socket);
		if (match) {
			GameService.emitRoom (match, "end");
			this.matches.delete (match.id);
		}
		else {
			this.queues.Normal = this.queues.Normal.filter ((s) => s.id !== socket.id)
			this.queues.Ultimate = this.queues.Ultimate.filter ((s) => s.id !== socket.id)
		}
	}
	
	findMatch (client: Socket): Pong {
		for (const match of this.matches.values ()) {
			if (match.isPlaying (client))
				return match;
		}
		return null;
	}

	handleInput (client: Socket, data: string): void {
		const match: Pong = this.findMatch (client);
		if (match) {
			const side: SIDE = (match.game.players[SIDE.LEFT].socket.id === client.id)? SIDE.LEFT: SIDE.RIGHT;
			match.handleInput (side, data)
			GameService.emitRoom (match, "paddle", side, match.game.players[side].paddle.position)
		}
	}

	
	async getliveGames (): Promise <Array <LiveMatch>> {
		let games = new Array <LiveMatch> ();

		for (const match of this.matches.values ()) {
			games.push (
			{
				id: match.id,
				leftPlayer: {
					user: match.game.players[0].socket.data.username,
					avatar: match.game.players[0].socket.data.avatar_url
				},
				rightPlayer: {
					user: match.game.players[1].socket.data.username,
					avatar: match.game.players[1].socket.data.avatar_url
				}
			})
		}
		return games;
	}

	async LiveGameBroadcast () {
		const games = await this.getliveGames ();
		this.gateWay.broadCastLiveGames (games);
	}

	@Interval (1000/60)
	async gameLoop () {
		for (const match of this.matches.values ()) {
			match.update ()
			if (match.scored) {
				GameService.emitRoom (match, "score", match.game.players.map ((p) => p.score))
				match.reset ();
			}
			if (match.isFinished ()) {
				GameService.emitRoom (match, "end");
				console.log ("ending match");
				await this.prisma.game.create ( {
					data: {
						players: {
							create: [
								{
									mode: match.mode === 'Normal'? gameMode.CLASSIC: gameMode.ULTIMATE,
									score: match.game.players[SIDE.LEFT].score,
									player: { connect: { id : match.game.players[SIDE.LEFT].socket.data.id }, }
								},
								{
									mode: match.mode === 'Normal'? gameMode.CLASSIC: gameMode.ULTIMATE,
									score: match.game.players[SIDE.RIGHT].score,
									player: { connect: { id : match.game.players[SIDE.RIGHT].socket.data.id}, }
								}
							]
						}
					},
				})
				this.matches.delete (match.id);
				this.LiveGameBroadcast ();
			}
			else {
				GameService.emitRoom (match, "ball", match.game.ball.position)
			}
		}
	}

}	