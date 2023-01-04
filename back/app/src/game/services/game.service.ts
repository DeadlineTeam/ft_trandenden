import { Socket } from "socket.io";
import { SIDE} from "../interfaces/game.interface"
import { Interval } from "@nestjs/schedule";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Pong } from "./match.service";
import { GameGateway } from "../game.gateway";
import { GameHistoryService } from "src/game-history/game-history.service";
import { UsersService } from "src/users/users.service";
import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { OnlineService } from "src/online/online.service";

import { GameInvite } from "src/online/types/gameInvite";

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
		private readonly gameHistoryService: GameHistoryService,
		private readonly userService: UsersService,
		private readonly onlineService: OnlineService,
	) {}

	queues: Queue = { Normal: [], Ultimate: []}

	matches: Map<string, Pong> = new Map ();

	matchesWithInvites: Map<string, Pong> = new Map (); 

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
			console.log (queue[i]);
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
		console.log ("player wants to join queue");
		const status = await this.userService.getStatus (socket.data.id);
		if (status.inGame) {
			socket.emit ("end");
			return;
		}
		else {
			this.onlineService.setInGame (socket.data.id, true);
		}
		socket.emit ('leftPlayer', socket.data)
		console.log ("heeeeeeere");
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
	
	findMatchById (id: number) {
		for (const match of this.matches.values ()) {
			for (const p of match.game.players) {
				if (p.socket.data.id === id)
					return match;
			}
		}
	}


	leaveMatch (socket: Socket): void {
		console.log ("player wants to leave match");
		const match: Pong = this.findMatch (socket);
		if (match) {
			GameService.emitRoom (match, "end");
			this.matches.delete (match.id);
			this.LiveGameBroadcast ();
			this.onlineService.setInGame (socket.data.id, false);
		}
		else {
			this.onlineService.setInGame (socket.data.id, false);
			this.queues.Normal = this.queues.Normal.filter ((s) => s.id !== socket.id);
			this.queues.Ultimate = this.queues.Ultimate.filter ((s) => s.id !== socket.id);
		}
		for (const match of this.matchesWithInvites.values ()) {
			const players = match.game.players;
			players.forEach ((p) => {
				if (p.socket.id === socket.id) {
					p.socket.emit ("end");
					this.matchesWithInvites.delete (match.id);
					this.onlineService.setInGame (p.socket.data.id, false);
				}
			})
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
				const game = match.game;
				const mode = match.mode;
				this.matches.delete (match.id);
				GameService.emitRoom (match, "end");
				console.log ("saving game", match.id)
				await this.gameHistoryService.addGameHistory (
					{
						player1: { id: game.players[0].socket.data.id},
						player2: { id: game.players[1].socket.data.id},
						player1Score: game.players[0].score,
						player2Score: game.players[1].score,
						gameMode: mode == "Ultimate"? "ULTIMATE": "CLASSIC",
				});
				this.LiveGameBroadcast ();
				break;
			}
			else {
				GameService.emitRoom (match, "ball", match.game.ball.position)
			}
		}
	}

	async invite (inviterId: number, invitee: number) {
		const user = await  this.userService.findById (invitee);
		const inviter = await this.userService.findById (inviterId);

		if (!user) {
			throw new HttpException ('User not found', HttpStatus.NOT_FOUND);
		}

		const status = await this.userService.getStatus (invitee);
		if (!status.online) {
			throw new HttpException ('User is not online', HttpStatus.NOT_FOUND);
		}
		if (status.inGame) {
			throw new HttpException ('User is in a game', HttpStatus.BAD_REQUEST);
		}

		// let's try to create a match
		const match = new Pong ('Normal');
		this.matchesWithInvites.set (match.id, match);
		
		// let's notify the other user
		this.onlineService.notify (invitee, "GameInvite",
		{
			id: match.id,
			inviter: inviter.username,
			mode: "Normal"
		} as GameInvite);

		// let's send the gameId to the requester
		return { gameId: match.id };
	}


	gameInvite (socket: Socket, gameId: string) {
		const match = this.matchesWithInvites.get (gameId);
		if (!match) {
			socket.emit ("end");
			// send a notification to the requester that
			// the invitee did not respond
			//
			return;
		}
		else {
			if (match.game.players.length === 2) {
				socket.emit ("end");
				return;
			}
			match.addPlayer (socket);
			if (match.game.players.length === 1) {
				socket.emit ("leftPlayer", socket.data)
			}
			else {
				match.game.players.forEach((p) => {
					p.socket.emit ("leftPlayer", match.game.players[0].socket.data)
					p.socket.emit ("rightPlayer", match.game.players[1].socket.data)
				})
			}
			if (match.game.players.length === 2) {
				this.matches.set (match.id, match);
				this.matchesWithInvites.delete (match.id);
				this.LiveGameBroadcast ();
			}
		}
	}

	decline (gameId: string) {
		const match = this.matchesWithInvites.get (gameId);
		if (match) {
			const inviterSocket = match.game.players[0].socket;
			this.onlineService.notify (inviterSocket.data.id, "GameInviteDeclined", { id: match.id });
			inviterSocket.emit ("end");
			this.matchesWithInvites.delete (match.id);
		}
	}
	
}	