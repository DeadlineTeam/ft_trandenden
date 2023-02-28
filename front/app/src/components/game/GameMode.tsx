import { useNavigate } from "react-router-dom"
import ImgNormMode from "./NormMode.jpg"
import ImgUltimateMode from "./UltimateMode.jpg"
import Pizzaman from"./pizza-chen-2016-1026-05.png"
import Pizzaman1 from"./pizzaboy.png"
import "./GameMode.css"
import axios from "axios"
import { UserContext } from "../ProtectedLayout"
import { useContext } from "react"
import { toast } from "react-toastify"

type IMode = {
	mode: string
}

function GameMode (props: IMode) {
	const mode: string = "Img" + props.mode + "Mode";
	const navigate = useNavigate ()
	const user = useContext (UserContext)

	const handleClick = () => {
		// check if the user is not in a game => navigate to game
		axios.get (`${process.env.REACT_APP_BACK_URL}/users/${user?.user.id}/online`, {withCredentials: true})
		.then (res => {
			if (res.data.inGame)
				toast ('you are already playing or waiting a game')
			else
				navigate ('/Game?mode=' + props.mode)
		})
	}


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



