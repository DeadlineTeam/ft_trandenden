import {Game, Player, SIDE, Vector} from '../interfaces/game.interface'
import { Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';


@Injectable ()
export class Pong {
	game: Game;
	mode: string; 
	id: string;
	scored: boolean;
	constructor (mode: string) {
		this.id =  (Math.random ()).toString (16).substring (2);
		this.scored = false;
		this.mode = mode;
		this.game = {
			players: [],
			watchers: [],
			ball: {
				radius: 0.013,
				position: { 
					x: 0.5,
					y: 0.5,
				},
				velocity: {
					direction: {
						x: Math.random(),
						y: Math.random()
					} ,
					speed: 0.006,
				}
			}
		}
		this.resetBall ()
	}
	addPlayer (client: Socket): void {
		const player: Player = {
			socket: client,
			paddle: {
				position: {
					x: (this.game.players.length === 0)? 0: 1 - 0.01,
					y: (1 - 0.17) / 2,
				},
				dimension: {
					x: 0.01,
					y: 0.17
				},
				speed: 0.06
			},
			score: 0
		}
		this.game.players.push (player);
	}

	addWatcher (client: Socket) {
		this.game.watchers.push (client);
	}

	isPlaying (client: Socket): boolean {
		for (const p of this.game.players) {
			if (p.socket.id === client.id)
				return true
		}
		return false
	}

	isWatching (client: Socket): boolean {
		for (const w of this.game.watchers) {
			if (w.id === client.id)
				return true
		}
		return false
	}
	handleInput (side: SIDE, input: string): void {
		let speed: number = this.game.players[side].paddle.speed;
		const dimensions: Vector = this.game.players[side].paddle.dimension;
		if (input === "up") {
			if (this.game.players[side].paddle.position.y - speed > 0)
				this.game.players[side].paddle.position.y -= speed;
		}
		else if (input === "down") {
			if (this.game.players[side].paddle.position.y + dimensions.y + speed < 1)
				this.game.players[side].paddle.position.y += this.game.players[side].paddle.speed;
		}
		else if (input === "right") {
			if (side === SIDE.LEFT) {
				if (this.game.players[side].paddle.position.x + dimensions.x + speed <= 0.5
					&& this.game.players[side].paddle.position.x + dimensions.x + speed <= this.game.ball.position.x)
					this.game.players[side].paddle.position.x += speed;
			}
			else if (side === SIDE.RIGHT) {
				if (this.game.players[side].paddle.position.x + dimensions.x + speed <= 1)
					this.game.players[side].paddle.position.x += speed;
			}
		}
		else if (input == "left") {
			if (side === SIDE.LEFT) {
				if (this.game.players[side].paddle.position.x - speed >= 0)
					this.game.players[side].paddle.position.x -= speed;
			}
			else if (side === SIDE.RIGHT) {
				if (this.game.players[side].paddle.position.x - speed >= 0.5 &&
					this.game.players[side].paddle.position.x - speed >= this.game.ball.position.x)
					this.game.players[side].paddle.position.x -= speed
			}
		}
	}
	resetBall (): void {
		
		this.game.ball.position.x = 0.5;
		this.game.ball.position.y = 0.5;
	
		this.game.ball.velocity.direction.x = -1 + 2 * Math.random()
		while (Math.abs (this.game.ball.velocity.direction.x) < 0.2)
			this.game.ball.velocity.direction.x = -1 + 2 * Math.random()

		this.game.ball.velocity.direction.y = -1 + 2 * Math.random ()
		while (Math.abs (this.game.ball.velocity.direction.y) < 0.2 )
			this.game.ball.velocity.direction.y = -1 + 2 * Math.random()
		
		const norm: number = Math.sqrt (Math.pow(this.game.ball.velocity.direction.x, 2) + Math.pow (this.game.ball.velocity.direction.y, 2))
		this.game.ball.velocity.direction.x /= norm
		this.game.ball.velocity.direction.y /= norm

	}
	reset (): void {
		this.scored = false;
		this.resetBall ()
	}
	update (): void {
		const updatePosition =  {
			x: this.game.ball.position.x + this.game.ball.velocity.direction.x * this.game.ball.velocity.speed,
			y: this.game.ball.position.y + this.game.ball.velocity.direction.y * this.game.ball.velocity.speed
		}

		if (updatePosition.x - this.game.ball.radius < 0 ||
			updatePosition.x + this.game.ball.radius > 1) {
			
			if (updatePosition.x - this.game.ball.radius < 0)
				this.game.players[SIDE.RIGHT].score++;
			else
				this.game.players[SIDE.LEFT].score++;
			this.scored = true;
		}
		
		if (updatePosition.y - this.game.ball.radius <= 0 ||
			updatePosition.y + this.game.ball.radius >= 1) {
			this.game.ball.velocity.direction.y *= -1;
		}
		const dimensions: Vector = this.game.players[SIDE.LEFT].paddle.dimension;
		if (
			updatePosition.y >= this.game.players[SIDE.LEFT].paddle.position.y &&
			updatePosition.y <= this.game.players[SIDE.LEFT].paddle.position.y + dimensions.y &&
			updatePosition.x >= this.game.players[SIDE.LEFT].paddle.position.x + dimensions.x &&
			updatePosition.x <= this.game.players[SIDE.LEFT].paddle.position.x + dimensions.x + this.game.ball.radius
			
		) {
			this.game.ball.velocity.direction.x = Math.abs (this.game.ball.velocity.direction.x)
		}

		if (
			updatePosition.y >= this.game.players[SIDE.RIGHT].paddle.position.y &&
			updatePosition.y <= this.game.players[SIDE.RIGHT].paddle.position.y + dimensions.y &&
			updatePosition.x <= this.game.players[SIDE.RIGHT].paddle.position.x &&
			updatePosition.x >= this.game.players[SIDE.RIGHT].paddle.position.x - this.game.ball.radius
		) {
			if (this.game.ball.velocity.direction.x > 0)
				this.game.ball.velocity.direction.x *= -1;
		}

		this.game.ball.position.x += this.game.ball.velocity.direction.x * this.game.ball.velocity.speed;
		this.game.ball.position.y += this.game.ball.velocity.direction.y * this.game.ball.velocity.speed;
	
	}

	isFinished (): boolean {
		const Score = 30;
		return ((this.game.players[SIDE.RIGHT].score == Score) || (this.game.players[SIDE.LEFT].score == Score))
	}
};