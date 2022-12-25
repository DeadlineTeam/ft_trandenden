import { Socket } from "socket.io";
import { SIDE} from "../interfaces/game.interface"
import { Interval } from "@nestjs/schedule";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Pong } from "./match.service";
import { User } from "@prisma/client";
import { UsersService } from "src/users/users.service";
import { SocketUserService } from "./SocketUserService";
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
		private readonly userService: UsersService,
		private readonly socketUserService: SocketUserService,
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
		console.log ("match started")
		this.matches.set (match.id, match);
		const games = await this.getliveGames ();
		this.gateWay.broadCastLiveGames (games);
	}
	

	
	async getPlayersInfo (players: holder <Socket>) {
		const data: holder <User | null> = {leftPlayer: null, rightPlayer: null}
		for (const p in players) {
			const user: User | null = await this.userService.findbylogin (this.socketUserService.get(players[p].id));
			data[p] = user
		}
		return data;
	}

	async Matching (queue: Array<Socket>, mode: string): Promise<void> {
		if (queue.length >= 2) {
			const match: Pong = new Pong (mode);
			/////// check if we do not have the same user
			const players: holder <Socket> = {
				leftPlayer: queue.shift (),
				rightPlayer: queue.shift ()
			}
			for (const [p, u] of Object.entries (players))
				match.addPlayer (u);
			
			const event = await this.getPlayersInfo (players);
			console.log ("hehheheh");
			for (const [p, u] of Object.entries (event))
				GameService.emitRoom (match, p, u)
			await this.startMatch (match)
		}
		else {
			const socket: Socket = queue[0];
			const player = await this.userService.findbylogin (this.socketUserService.get (socket.id))
			socket.emit ('leftPlayer', player)
		}
	}

	async joinQueue (socket: Socket, mode: string) {
		this.queues[mode].push (socket)
		this.Matching (this.queues[mode], mode);
	}

	async watchGame (socket: Socket, id: string) {
		const match = this.matches.get (id)
		if (match) {
			match.addWatcher (socket);
			console.log ("watcher added")
			const event = await this.getPlayersInfo (
				{
					leftPlayer: match.game.players[0].socket,
					rightPlayer: match.game.players[1].socket 
				});
			for (const [p, u] of Object.entries (event)) {
				socket.emit (p, u);
			}
			socket.emit("score", match.game.players.map ((p) => p.score))
		}
		else {
			socket.emit ('end');
		}
	}

	async endMatch (pong: Pong) {
		GameService.emitRoom (pong, "end");
		await this.prisma.game.create ( {
			data: {
				mode: pong.mode === 'Normal'? gameMode.CLASSIC: gameMode.ULTIMATE,
				players: {
					create: [
						{
							score: pong.game.players[SIDE.LEFT].score,
							player: { connect: { username: this.socketUserService.get (pong.game.players[SIDE.LEFT].socket.id)}, }
						},
						{
							score: pong.game.players[SIDE.RIGHT].score,
							player: { connect: { username: this.socketUserService.get (pong.game.players[SIDE.RIGHT].socket.id)}, }
						}
					]
				}
			},
		})
		this.matches.delete (pong.id);
		this.LiveGameBroadcast ();
	}
	
	leaveMatch (socket: Socket): void {
		const match: Pong = this.findMatch (socket);
		if (match)
			this.endMatch (match);
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
			const lpusername: string = this.socketUserService.get (match.game.players[0].socket.id)
			const lpUser: User | null = await this.userService.findbylogin (lpusername);
			
			const rpusername: string = this.socketUserService.get (match.game.players[1].socket.id)
			const rpUser: User | null = await this.userService.findbylogin (rpusername);
			
	
			const matchdata: LiveMatch = <LiveMatch> {
				id: match.id,
				leftPlayer: {
					user: lpusername,
					avatar: lpUser.avatar_url
				},
				rightPlayer: {
					user: rpusername,
					avatar: rpUser.avatar_url
				}
			}
			games.push (matchdata)
		}
		return games;
	}

	
	// @Interval (1000)
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
				this.endMatch (match);
			}
			else {
				GameService.emitRoom (match, "ball", match.game.ball.position)
			}
		}
	}
}