import {useEffect, useState, useRef, MouseEvent} from "react"
import React from "react";
import Sketch from "react-p5"
import p5Types from "p5";
import io from 'socket.io-client'
import "./game.css"
import Sidebar from "../Sidebar";
import img from "./eel-orch.jpeg"


enum STATE {
	WAITING,
	PLAYING,
	OVER,
}

interface Vector2D {
	x: number;
	y: number;
}

interface Color {
	r: number;
	g: number;
	b: number
}

abstract class Shape {
	dimensions: Vector2D;
	position: Vector2D;
	color: Color;
	constructor (dims: Vector2D, pos: Vector2D, c: Color){
		this.dimensions = dims		
		this.position = pos
		this.color = c;

	}
	updateDimension (dimensions: Vector2D) {
		this.dimensions = dimensions
	}
	updatePosition (position: Vector2D) {
		this.position = position
	}
	draw (p5: p5Types): void {
		p5.fill (this.color.r, this.color.g, this.color.b)
		this.draw_ (p5);
	}
	abstract draw_ (p5: p5Types): void
}

class Ball extends Shape {
	static radius: number = 0.013;
	constructor (dims: Vector2D, pos: Vector2D) {
		super (dims, pos, {r: 236, g: 236, b: 43})
	}
	draw_ (p5: p5Types): void {
		p5.circle (this.position.x * this.dimensions.x, this.position.y * this.dimensions.y, 2 * Ball.radius * this.dimensions.x)
	}
}

class Paddle extends Shape{
	static w: number = 0.01
	static h: number = 0.17
	constructor (dims: Vector2D, pos: Vector2D) {
		super (dims, pos, {r: 255, g: 255, b: 255})
	}
	draw_ (p5: p5Types): void {
		p5.rect (this.position.x * this.dimensions.x, this.position.y * this.dimensions.y , Paddle.w * this.dimensions.x, Paddle.h * this.dimensions.y)
	}
}

class Game {
	width: number;
	height: number;
	ball: Ball;
	paddles: Paddle [] = [];
	state: STATE;
	score:  number[]
	constructor (width: number, height: number) {
		this.width = width;
		this.height = height;
		this.ball = new Ball ({x:this.width, y: this.height}, {x: 0.5, y: 0.5})
		this.paddles = [new Paddle ({x: this.width, y: this.height}, {x: 0, y: (1 - Paddle.h) / 2}),
						new Paddle ({x: this.width, y: this.height}, {x: 1 - Paddle.w, y: (1 - Paddle.h) / 2})]
		this.state = STATE.WAITING
		this.score = [0, 0]
	}
	end (): void { this.state = STATE.OVER; }
	start (): void { this.state = STATE.PLAYING; }
	setScore (score : number[]) { this.score = score }

	resize (width: number, height: number) {
		this.width = width;
		this.height = height;
		const dimensions: Vector2D = {x: this.width, y: this.height}
		this.ball.updateDimension (dimensions);
		this.paddles.forEach ((paddle) => { paddle.updateDimension (dimensions)})
	}
	drawTable (p5: p5Types) {
		p5.background('#192125');
		p5.fill ('#FFFFFF')
		p5.circle (this.width / 2, this.height / 2, 0.17 * this.width)
		p5.fill ('#192125')
		p5.circle (this.width / 2, this.height / 2, 0.165 * this.width )
		p5.fill ('#FFFFFF')
		p5.rect (Math.round (this.width * (0.5 - 0.001)), 0, 0.002 * this.width, this.height)
		this.paddles.forEach ((p) => { p.draw (p5)})
	}
 	draw (p5: p5Types): void {
		if (this.state == STATE.OVER) {
			p5.noLoop();
		}
		else {
			p5.background('#192125');
			p5.fill ('#FFFFFF')
			p5.circle (this.width / 2, this.height / 2, 0.17 * this.width)
			p5.fill ('#192125')
			p5.circle (this.width / 2, this.height / 2, 0.165 * this.width )
			p5.fill ('#FFFFFF')
			p5.rect (Math.round (this.width * (0.5 - 0.001)), 0, 0.002 * this.width, this.height)
			this.ball.draw (p5)
			this.paddles.forEach ((p) => { p.draw (p5)})
		}
	}
}


enum SIDE {
	LEFT,
	RIGHT,
}

type IAvatar = {
	ImgURL: string;
	UserName: string; 
	Side: SIDE;
	score: number
}


const Avatar = (props: IAvatar) => {

	const avatar = [
		<img src={props.ImgURL} alt= {props.UserName}/>,
		<p>{props.UserName}</p>
	]
	return (
		<div className="Avatar">
			{avatar[Number(props.Side)]}
			{avatar[Number(!props.Side)]}
		</div>
	)
}

type IPlayers = {
	left: IAvatar;
	right: IAvatar;
}

const GameState = (props: IPlayers) => {
	
	return (
		<div className="GameState">
			<Avatar 
				ImgURL= {props.left.ImgURL}
				UserName= {props.left.UserName}
				Side={SIDE.LEFT}
				score={props.left.score}
			/>
			<div className="Score">
				<p>{props.left.score + " : " + props.right.score}</p>
			</div>
			<Avatar 
				ImgURL= {props.right.ImgURL}
				UserName= {props.right.UserName}
				Side={SIDE.RIGHT}
				score={props.right.score}
			/>
		</div>
	)
}


type Icanvas = {
	width: number,
	height: number
}

const socket = io ("ws://localhost:3001/playgame")

function GameCanvas ({width, height}: Icanvas) {
	const [game, setGame] = useState<Game> (new Game (width, width * 0.5))
	
	useEffect (() => {
		socket.on ('connect', () => {
			socket.emit ("play", "standard")
		})
		socket.on ('disconnect', () => {
			game.end ()
		})
		socket.on ('score', (score) => {
			game.setScore (score)
		})
		socket.on ('end', () => {
			game.end ()
		})
		socket.on ('start', () => {
			game.start ()
		})
		socket.on ('ball', (position) => {
			game.ball.updatePosition (position)
		})
		socket.on ('paddle', (...args) => {
			// console.log (args);
			game.paddles[args[0]].updatePosition(args[1])
		})
		return () => {
			socket.off('connect')
			socket.off('disconnect')
			socket.off ('score')
			socket.off ('end')
			socket.off ('ball')
			socket.off ('paddle')
		}
	}, [])

	const setup = (p5: p5Types, canvasParentRef: Element) => {
		const canvas = p5.createCanvas (width, height).parent (canvasParentRef)
		canvas.mouseWheel ((e: MouseEvent) => {
			// there is a problem here
			// if (e.)
			// if (e.deltaY > 100) {
			// 	socket.emit ("input", "up")
			// }
			// else if (e.deltaY < -100) {
			// 	socket.emit ("input", "down")
			// }
		})
		p5.frameRate (120)
	}

	const draw = (p5: p5Types) => {
		game.draw (p5)
	}
	const windowResized = (p5: p5Types) => {
		game.resize (width, height)
		p5.resizeCanvas (width, height, false);
		
	}

	const left: IAvatar = {
		ImgURL: "https://cdn.intra.42.fr/users/8f34afbfdf4d9a2e668bfed4a418f71e/eel-orch.jpg",
		UserName: "l9irch",
		score: 0,
		Side: SIDE.LEFT
	}
	
	const right: IAvatar = {
		ImgURL: "https://cdn.intra.42.fr/users/8f34afbfdf4d9a2e668bfed4a418f71e/eel-orch.jpg",
		UserName: "l9irch",
		score: 0,
		Side: SIDE.RIGHT
	}

	return (
		<div>
			<GameState left={left} right={right}/>
			<Sketch windowResized={windowResized} setup={setup} draw={draw} />
		</div>
	)
}



const GameComponent: React.FC<any> = () => {
	const pRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);
	
	function onWidthChange () {
		if (pRef.current) {
			setWidth (pRef.current.offsetWidth)
		}
	}
	useEffect (() => {
		if (pRef.current) {
			setWidth (pRef.current.offsetWidth)
			window.addEventListener ('resize', onWidthChange)
		}
		return () => {
			window.removeEventListener ('resize', onWidthChange)
		}
	}, [])

	const left: IAvatar = {
		ImgURL: "https://cdn.intra.42.fr/users/8f34afbfdf4d9a2e668bfed4a418f71e/eel-orch.jpg",
		UserName: "l9irch",
		score: 0,
		Side: SIDE.LEFT
	}
	
	const right: IAvatar = {
		ImgURL: "https://cdn.intra.42.fr/users/8f34afbfdf4d9a2e668bfed4a418f71e/eel-orch.jpg",
		UserName: "l9irch",
		score: 0,
		Side: SIDE.RIGHT
	}

	return  (
			<div className="GameContainer">
				<h1>Pong</h1>
				
				<div className="game" ref={pRef}>
					{width && <GameCanvas width={width} height={width / 2}/>}
				</div>
			</div>
	)
}


export default GameComponent;
