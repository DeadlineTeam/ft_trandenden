import { useNavigate } from "react-router-dom"
import ImgNormMode from "./NormMode.jpg"
import ImgUltimateMode from "./UltimateMode.jpg"
import Pizzaman from"./pizza-chen-2016-1026-05.png"
import Pizzaman1 from"./pizzaboy.png"
import "./GameMode.css"

type IMode = {
	mode: string
}

function GameMode (props: IMode) {
	const mode: string = "Img" + props.mode + "Mode";
	const navigate = useNavigate ()
	const handleClick = () => navigate ('/Game?mode=' + props.mode)
	return (
		<div className='mode'>
			<img 
				className="modeImg" 
				src={props.mode === "Normal"? ImgNormMode: ImgUltimateMode}
				alt={mode} 
				width={"100%"} 
				height={"100%"}
				
			/>
			<img className="modeImg" src={props.mode === "Normal"? Pizzaman: Pizzaman1} width={"100%"} 
				height={"100%"}
				/>
			<div className="modebg" onClick={handleClick}>
				<p className="modename">{props.mode + " Mode"}</p>
			</div>
		</div>
	)
}

export function GameChoose () {
	return (
		<div className="gamechoose">
			<h1> Choose your mode </h1>
			<div className="gamechoice">
				<GameMode mode="Normal"/>
				<GameMode mode="Ultimate"/>
			</div>
		</div>
	)
}



