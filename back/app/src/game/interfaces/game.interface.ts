import { Socket } from "socket.io";

export enum SIDE {
	LEFT= 0,
	RIGHT= 1
}

export interface Paddle {
	position: Vector;
	dimension: Vector;
	speed: number
}

export interface Player {
	socket: Socket;
	paddle: Paddle;
	score: number
}

export interface Vector {
	x: number;
	y: number;
}

export interface Velocity {
	direction: Vector
	speed: number
}

export interface Ball {
	radius: number;
	position: Vector;
	velocity: Velocity;
}

export interface Game {
	windowRatio: number;
	players: Array<Player>;
	ball: Ball;
}